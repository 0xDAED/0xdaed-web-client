#!/usr/bin/env node
/**
 * Автоматическое добавление базовых JSDoc комментариев в проект
 * Использование: yarn jsdoc:add
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { globSync } from 'glob';
import parser from '@babel/parser';
import traverse from '@babel/traverse';
import generator from '@babel/generator';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Конфигурация
const CONFIG = {
  patterns: [
    'src/**/*.js',
    'src/**/*.vue',
    '!src/**/node_modules/**',
    '!src/**/__tests__/**',
    '!src/**/*.spec.js',
  ],
  backup: true,
  dryRun: process.argv.includes('--dry-run') || false,
  verbose: true,
};

// Счетчики
let stats = {
  filesProcessed: 0,
  filesModified: 0,
  functionsAdded: 0,
  classesAdded: 0,
  methodsAdded: 0,
  skipped: 0,
};

/**
 * Генерирует базовый JSDoc для функции
 */
function generateFunctionJSDoc(node, functionName) {
  const params = node.params || node.value?.params || [];
  const paramDocs = params
    .map((param, index) => {
      let paramName = 'param';
      if (param.type === 'Identifier') {
        paramName = param.name;
      } else if (param.type === 'AssignmentPattern' && param.left?.name) {
        paramName = param.left.name;
      } else if (param.type === 'RestElement' && param.argument?.name) {
        paramName = `...${param.argument.name}`;
      }

      return ` * @param {any} ${paramName} - Описание параметра ${paramName}`;
    })
    .join('\n');

  return `/**
 * ${functionName ? `${functionName} - ` : ''}TODO: Добавить описание функции
${paramDocs ? paramDocs + '\n' : ''}
 * @returns {any} TODO: Описать возвращаемое значение
 */`;
}

/**
 * Генерирует базовый JSDoc для класса
 */
function generateClassJSDoc(className) {
  return `/**
 * ${className} - TODO: Добавить описание класса
 */`;
}

/**
 * Генерирует базовый JSDoc для метода класса
 */
function generateMethodJSDoc(node, methodName) {
  const params = node.params || [];
  const paramDocs = params
    .map((param, index) => {
      let paramName = 'param';
      if (param.type === 'Identifier') {
        paramName = param.name;
      }
      return ` * @param {any} ${paramName} - Описание параметра ${paramName}`;
    })
    .join('\n');

  return `/**
 * ${methodName} - TODO: Добавить описание метода
${paramDocs ? paramDocs + '\n' : ''}
 * @returns {any} TODO: Описать возвращаемое значение
 */`;
}

/**
 * Генерирует базовый JSDoc для переменной/константы
 */
function generateVariableJSDoc(varName) {
  return `/**
 * @type {any}
 */`;
}

/**
 * Добавляет JSDoc к коду
 */
function addJSDocToCode(code, filePath) {
  try {
    const ast = parser.parse(code, {
      sourceType: 'module',
      plugins: ['jsx', 'typescript', 'vue'],
    });

    const nodesToAddJSDoc = [];

    // Обходим AST дерево
    traverse.default(ast, {
      // Функции
      FunctionDeclaration(path) {
        if (
          !path.node.leadingComments ||
          !path.node.leadingComments.some(
            (c) => c.value.includes('@param') || c.value.includes('@returns')
          )
        ) {
          const jsdoc = generateFunctionJSDoc(path.node, path.node.id?.name || 'Функция');
          nodesToAddJSDoc.push({
            node: path.node,
            jsdoc,
            type: 'function',
          });
        }
      },

      // Стрелочные функции (экспортируемые)
      VariableDeclarator(path) {
        if (
          path.node.init?.type === 'ArrowFunctionExpression' ||
          path.node.init?.type === 'FunctionExpression'
        ) {
          if (!path.node.leadingComments) {
            const jsdoc = generateFunctionJSDoc(path.node.init, path.node.id?.name || 'Функция');
            nodesToAddJSDoc.push({
              node: path.node,
              jsdoc,
              type: 'arrow-function',
            });
          }
        }
      },

      // Классы
      ClassDeclaration(path) {
        if (!path.node.leadingComments) {
          const jsdoc = generateClassJSDoc(path.node.id?.name || 'Класс');
          nodesToAddJSDoc.push({
            node: path.node,
            jsdoc,
            type: 'class',
          });
        }
      },

      // Методы класса
      ClassMethod(path) {
        if (!path.node.leadingComments) {
          const methodName = path.node.key?.name || 'Метод';
          const jsdoc = generateMethodJSDoc(path.node, methodName);
          nodesToAddJSDoc.push({
            node: path.node,
            jsdoc,
            type: 'method',
          });
        }
      },

      // Экспортируемые переменные (если нет комментариев)
      ExportNamedDeclaration(path) {
        if (path.node.declaration?.type === 'VariableDeclaration') {
          path.node.declaration.declarations.forEach((decl) => {
            if (!decl.leadingComments) {
              const jsdoc = generateVariableJSDoc(decl.id?.name || 'Переменная');
              nodesToAddJSDoc.push({
                node: decl,
                jsdoc,
                type: 'variable',
              });
            }
          });
        }
      },
    });

    if (nodesToAddJSDoc.length === 0) {
      return { modified: false, code };
    }

    // Сортируем узлы в обратном порядке (чтобы не сбивать позиции при вставке)
    nodesToAddJSDoc.sort((a, b) => b.node.start - a.node.start);

    let newCode = code;
    nodesToAddJSDoc.forEach((item) => {
      const insertPos = item.node.start;
      newCode = newCode.slice(0, insertPos) + item.jsdoc + '\n' + newCode.slice(insertPos);

      // Обновляем статистику
      if (item.type === 'function' || item.type === 'arrow-function') stats.functionsAdded++;
      else if (item.type === 'class') stats.classesAdded++;
      else if (item.type === 'method') stats.methodsAdded++;
    });

    return { modified: true, code: newCode, count: nodesToAddJSDoc.length };
  } catch (error) {
    console.error(`Ошибка обработки файла ${filePath}:`, error.message);
    stats.skipped++;
    return { modified: false, code };
  }
}

/**
 * Обрабатывает один файл
 */
function processFile(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf8');

    // Создаем бэкап
    if (CONFIG.backup) {
      const backupPath = filePath + '.backup';
      fs.writeFileSync(backupPath, content, 'utf8');
    }

    // Обрабатываем .vue файлы (только секция <script>)
    if (filePath.endsWith('.vue')) {
      const scriptRegex = /(<script[^>]*>)([\s\S]*?)(<\/script>)/;
      const match = content.match(scriptRegex);

      if (match) {
        const scriptContent = match[2];
        const result = addJSDocToCode(scriptContent, filePath);

        if (result.modified) {
          const newContent = content.replace(scriptRegex, `$1${result.code}$3`);

          if (!CONFIG.dryRun) {
            fs.writeFileSync(filePath, newContent, 'utf8');
          }

          stats.filesModified++;
          if (CONFIG.verbose) {
            console.log(`✓ ${filePath} (${result.count} комментариев добавлено)`);
          }
          return;
        }
      }
    }
    // Обрабатываем .js файлы
    else if (filePath.endsWith('.js')) {
      const result = addJSDocToCode(content, filePath);

      if (result.modified) {
        if (!CONFIG.dryRun) {
          fs.writeFileSync(filePath, result.code, 'utf8');
        }

        stats.filesModified++;
        if (CONFIG.verbose) {
          console.log(`✓ ${filePath} (${result.count} комментариев добавлено)`);
        }
        return;
      }
    }

    stats.filesProcessed++;
    if (CONFIG.verbose) {
      console.log(`○ ${filePath} (без изменений)`);
    }
  } catch (error) {
    console.error(`Ошибка при обработке ${filePath}:`, error.message);
    stats.skipped++;
  }
}

/**
 * Основная функция
 */
function main() {
  console.log('🚀 Запуск автоматического добавления JSDoc...\n');

  // Находим все файлы
  const files = [];
  CONFIG.patterns.forEach((pattern) => {
    files.push(...globSync(pattern, { cwd: process.cwd() }));
  });

  console.log(`📁 Найдено файлов: ${files.length}\n`);

  if (CONFIG.dryRun) {
    console.log('🔍 Режим предпросмотра (файлы не будут изменены)\n');
  }

  // Обрабатываем каждый файл
  files.forEach((filePath) => {
    processFile(path.join(process.cwd(), filePath));
    stats.filesProcessed++;
  });

  // Выводим статистику
  console.log('\n📊 Статистика:');
  console.log(`  Всего файлов: ${stats.filesProcessed}`);
  console.log(`  Изменено: ${stats.filesModified}`);
  console.log(`  Функций с комментариями: ${stats.functionsAdded}`);
  console.log(`  Классов с комментариями: ${stats.classesAdded}`);
  console.log(`  Методов с комментариями: ${stats.methodsAdded}`);
  console.log(`  Пропущено: ${stats.skipped}`);

  if (CONFIG.backup) {
    console.log('\n💾 Созданы бэкапы файлов с расширением .backup');
  }

  console.log('\n✅ Готово! Не забудьте проверить и доработать сгенерированные комментарии.');
}

// Запускаем скрипт
main();
