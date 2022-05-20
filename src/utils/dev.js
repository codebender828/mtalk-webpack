export const __DEBUG__ = process.env.NODE_ENV !== "production";
export const __STAGING__ = process.env.NODE_ENV !== "staging";

export const debugCreator =
  (namespace, isOpen = true) =>
  (...messages) => {
    if (!__DEBUG__ || !isOpen) {
      return;
    }
    console.log(`${namespace}:`, ...messages);
  };

export const errorReporterCreator =
  (namespace) =>
  (...args) => {
    let errorObject;

    if (!args || args.length === 0) {
      return;
    }

    errorObject = args.pop();

    if (!errorObject && !errorObject.message && !errorObject.data) {
      return;
    }

    // @case: 请求报错
    if (errorObject.data) {
      namespace = "Request";
      errorObject.message = errorObject.data.data || errorObject.data.msg;
      errorObject.stack = JSON.stringify(errorObject);
    }

    console.error(
      `${namespace}:`,
      ...args,
      `\n - message: ${errorObject.message}`,
      `\n - stack: ${errorObject.stack}`
    );

    if (!__DEBUG__) {
      // logger.logAction('caught_error', {
      //   type: namespace,
      //   message: `${args.join(', ')} - ${errorObject.message}`,
      //   detail: errorObject.stack
      // })

      return null;
    }
  };

export const errorReporter = errorReporterCreator("uncategory");

// 空方法 Placeholder
export const NOOP = () => {};
