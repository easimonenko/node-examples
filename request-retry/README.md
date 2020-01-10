# Node.js Examples

## Request Retry

Sometimes, due to network failures, the request fails. The usual situation is, in this case, the completion of the script with an error, which in some cases is unacceptable. To avoid this and repeat the request until it succeeds, you can use the retry package.

Бывает так, что из-за сбоев в сети запрос завершается с ошибкой. Обычной ситуацией является, в таком случае, завершение скрипта с ошибкой, что в некоторых случаях неприемлемо. Для избегания такого и повторения запроса, пока он не выполнится успешно, можно воспользоваться пакетом retry.

- [request-retry.js](./request-retry.js) uses `retry` with callback.
- [request-promise-retry.js](./request-promise-retry.js) uses `promise-retry` with promise.

This examples require packages: `retry`, `promise-retry`, `request-promise-native`, `request`.

(c) Evgeny Simonenko, 2020
