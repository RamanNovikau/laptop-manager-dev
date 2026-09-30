# Управление статусами ноутбуков

[English version](README.md)

Небольшая реализация на TypeScript для управления статусами ноутбуков на складе с проверкой переходов, историей изменений и правилом возврата в течение 14 дней.

## План

1. Определить статусы ноутбука, айди ноутбука и тип записи истории статусов.
2. Определить допустимые переходы и реализовать функцию изменения статуса.
3. Добавить проверку недопустимых переходов и правило возврата в течение 14 дней.
4. Добавить простой типизированный класс ошибок для отклонённых переходов.
5. Написать Jest-тесты для допустимых и недопустимых переходов, возврата, истории и ошибок.

## Решение

Реализация специально сделана небольшой и не использует базу данных, API, frontend или persistence layer.

Проект разделён на несколько простых частей:

* `src/types.ts` содержит основные TypeScript-типы.
* `src/errors.ts` содержит кастомную ошибку для отклонённых переходов статуса.
* `src/laptop.ts` содержит бизнес-логику изменения статусов ноутбука.
* `src/index.ts` содержит небольшой пример для локальной проверки работы решения.
* `tests/laptop.test.ts` содержит unit-тесты.

Допустимые переходы явно определены в таблице переходов:

```text
InStock -> Reserved, Sold, WrittenOff
Reserved -> InStock, Sold
Sold -> InStock
WrittenOff -> дальнейшие переходы запрещены
```

Модель `Laptop` содержит `id` для идентификации ноутбука и `soldAt`, поскольку переход `Sold -> InStock` напрямую зависит от времени, прошедшего с момента продажи.

Каждое успешное изменение статуса создаёт запись в истории, содержащую:

* предыдущий статус
* новый статус
* дату

Текущая дата передаётся в функцию аргументом вместо использования `new Date()` непосредственно внутри бизнес-логики. Это делает логику детерминированной и удобной для тестирования.

## AI-generated code

Реализация была выполнена с использованием AI.

Основным coding agent был **DeepSeek Harness Agent**. Он использовался для реализации TypeScript-решения, бизнес-логики и Jest-тестов.

**ChatGPT** использовался как дополнительный AI-помощник для:

* ревью реализации;
* обсуждения структуры проекта;
* обсуждения решений по `id` и `soldAt`;
* проектирования слоя обработки ошибок;
* проверки покрытия тестами;
* подготовки и редактирования README.

Следующие файлы содержат код, сгенерированный AI:

* `src/types.ts`
* `src/errors.ts`
* `src/laptop.ts`
* `src/index.ts`
* `tests/laptop.test.ts`

AI-generated код помечен комментарием:

```ts
// AI GENERATED
```

AI-generated реализация была проверена и при необходимости изменена вручную.

Согласно требованиям задания, коммиты должны использовать следующие префиксы:

```text
ai:     AI-generated код без изменений
manual: написанный вручную код или изменения AI-generated кода
```

AI автоматически не создавал коммиты.

## Что в задании было непонятно

### 1. "Не позднее 14 дней после продажи"

Я трактовал это условие как возможность вернуть ноутбук **ровно через 14 дней после продажи**.

Например:

```text
Продажа:   1 сентября, 10:00
Возврат:   15 сентября, 10:00
Результат: разрешено
```

Возврат после этого момента запрещается.

Поэтому в реализации используется условие:

```ts
elapsedTime <= 14 days
```

### 2. Где хранить дату продажи

Для проверки правила возврата необходимо знать время, прошедшее между продажей и возвратом.

Технически дату продажи можно было бы получить из истории статусов, однако я решил хранить её отдельно:

```ts
soldAt?: Date
```

Это делает бизнес-правило `Sold -> InStock` более простым и позволяет не искать дату продажи в истории при каждом возврате.

История при этом сохраняется отдельно как audit trail всех изменений статуса.

### 3. Дата списания

Я не добавлял отдельное поле `writtenOffAt`.

Дата списания уже доступна в записи истории:

```text
InStock -> WrittenOff
```

Добавление отдельного поля дублировало бы эту информацию и не требовалось условиями задания.

## AI prompts

### Промт для DeepSeek Harness Agent

Основной промт для реализации:

```text
You are working on a TypeScript coding test.

Task: implement laptop inventory status transitions and tests.

Requirements:

Allowed transitions:
- InStock -> Reserved, Sold, WrittenOff
- Reserved -> InStock, Sold
- Sold -> InStock, but only if the return happens no later than 14 days after the sale
- WrittenOff -> no further transitions

A transition that is not allowed must throw a clear, meaningful error.

Every successful status change must be recorded in history:
- previous status
- new status
- date

Create a clean, simple TypeScript solution without overengineering.

Please do the following:

1. Create appropriate TypeScript types/interfaces for:
   - laptop statuses
   - laptop state
   - status history entry
   - any other required data

2. Implement the main function responsible for changing the laptop status.

3. Implement the 14-day return rule for Sold -> InStock.
   Make the date handling deterministic and testable. Avoid relying directly on the current time inside business logic if possible. Prefer passing the current date/time as an argument or injecting a clock.

4. Create comprehensive unit tests using Jest.
   Tests must cover:
   - all valid transitions
   - all invalid transitions
   - WrittenOff as a terminal state
   - Sold -> InStock within 14 days
   - Sold -> InStock exactly at 14 days
   - Sold -> InStock after 14 days
   - history creation
   - correct previous/new statuses
   - history date
   - error messages

5. Mark all code and tests that were generated by AI with a clear comment such as:
   // AI GENERATED
   Do not add fake comments pretending that code was manually written.

6. Create/update README.md.

README must contain:

## Plan
A short 3-5 step implementation plan written before the implementation.

## Solution
A short explanation of the architecture and the main decisions.

## AI-generated code
Clearly state which files/parts were generated by AI.

## What was unclear
Answer:
"What was unclear in the task and how did you resolve it?"

If something is ambiguous, make a reasonable assumption and explicitly document it in README. In particular, document how you interpret "no later than 14 days after sale" and how the sale date is stored.

## AI prompts
Add the exact prompts used with AI. Include the original prompt in English and Russian.

## Testing
Explain how to run the tests.

Keep the implementation small enough to reasonably fit a 1-hour coding test.

Do not add unnecessary libraries or complex architecture.

Do not implement a database, API, frontend, or persistence layer.

Before finishing:
- inspect the entire project
- make sure TypeScript compiles
- make sure all tests pass
- make sure README is complete
- make sure the implementation matches every requirement
- do not modify unrelated files

Important:
The task explicitly says commits should use:
- ai: for AI-generated code without changes
- manual: for manually written code or modifications to AI-generated code

Do NOT create commits automatically. Just structure the changes so it is easy to identify AI-generated code and manually modified code.

Use English for code, variable names, types, test descriptions, and README.
```

### Русская версия промта

```text
Ты работаешь над тестовым заданием на TypeScript.

Задача: реализовать изменение статусов ноутбука на складе и тесты.

Требования:

Допустимые переходы:
- InStock -> Reserved, Sold, WrittenOff
- Reserved -> InStock, Sold
- Sold -> InStock, но только если возврат произошел не позднее 14 дней после продажи
- WrittenOff -> дальнейшие переходы запрещены

Недопустимый переход должен выбрасывать понятную и информативную ошибку.

Каждое успешное изменение статуса должно записываться в историю:
- предыдущий статус
- новый статус
- дата

Создай чистое и простое решение на TypeScript без избыточной архитектуры.

Необходимо:

1. Создать подходящие TypeScript types/interfaces для:
   - статусов ноутбука
   - состояния ноутбука
   - записи истории статусов
   - других необходимых данных

2. Реализовать основную функцию изменения статуса ноутбука.

3. Реализовать правило возврата в течение 14 дней для Sold -> InStock.
   Работа с датами должна быть детерминированной и удобной для тестирования. По возможности не используй текущее время напрямую внутри бизнес-логики. Лучше передавать текущую дату/время аргументом или использовать clock.

4. Создать comprehensive unit tests с использованием Jest.
   Тесты должны покрывать:
   - все допустимые переходы
   - все недопустимые переходы
   - WrittenOff как конечный статус
   - Sold -> InStock в течение 14 дней
   - Sold -> InStock ровно через 14 дней
   - Sold -> InStock после 14 дней
   - создание истории
   - правильные предыдущий и новый статусы
   - дату изменения
   - сообщения об ошибках

5. Пометить весь код и тесты, сгенерированные AI, понятным комментарием:
   // AI GENERATED
   Не добавляй фальшивые комментарии, выдающие AI-код за написанный вручную.

6. Создать или обновить README.md.

README должен содержать:

## Plan
Краткий план реализации из 3-5 пунктов, написанный до реализации.

## Solution
Краткое описание архитектуры и основных решений.

## AI-generated code
Указать, какие файлы или части были сгенерированы AI.

## What was unclear
Ответить на вопрос:
"Что в задании было непонятно и как это было решено?"

Если что-то неоднозначно, сделай разумное предположение и явно опиши его в README. В частности, объясни трактовку "не позднее 14 дней после продажи" и где хранится дата продажи.

## AI prompts
Добавить точные промты, которые использовались с AI. Включить оригинальный промт на английском и русском языках.

## Testing
Объяснить, как запускать тесты.

Решение должно быть достаточно небольшим, чтобы его можно было разумно выполнить за 1 час.

Не добавляй ненужные библиотеки или сложную архитектуру.

Не реализовывай database, API, frontend или persistence layer.

Перед завершением:
- проверь весь проект
- убедись, что TypeScript компилируется
- убедись, что все тесты проходят
- убедись, что README полный
- убедись, что реализация соответствует всем требованиям
- не изменяй несвязанные файлы

Важно:
В задании явно указаны префиксы коммитов:
- ai: для AI-generated кода без изменений
- manual: для написанного вручную кода или изменений AI-generated кода

Не создавай коммиты автоматически. Просто организуй изменения так, чтобы было понятно, какой код был сгенерирован AI, а какой изменен вручную.

Используй английский язык для кода, названий переменных, типов, описаний тестов и README.
```

### Дополнительные промты ChatGPT

ChatGPT также использовался для ревью кода и обсуждения архитектурных решений:


```text
Add a simple index.ts entry point so the project can be built and run locally to demonstrate how the status transitions work.
```

```text
Prepare the README according to the task requirements. Include the implementation plan, solution, AI-generated code, unclear requirements, and exact AI prompts.
```

## Тестирование

Установить зависимости:

```bash
npm install
```

Проверить компиляцию TypeScript:

```bash
npm run build
```

Запустить unit-тесты:

```bash
npm test
```

Запустить локальную демонстрацию:

```bash
npm run build
npm start
```

`src/index.ts` показывает несколько допустимых изменений статуса и выводит итоговое состояние ноутбука и историю изменений.

## Git commits

В задании требуется разделять AI-generated код и ручные изменения.

Пример для AI-generated кода без изменений:

```bash
git add src/laptop.ts
git commit -m "ai: implement laptop status transitions"
```

Для написанного вручную кода или изменений AI-generated кода:

```bash
git add src/laptop.ts
git commit -m "manual: refine transition error handling"
```

AI автоматически не создаёт коммиты.
