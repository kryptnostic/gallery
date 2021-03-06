import validateUUID from 'uuid-validate';

export default class Utils {

  static isValidUuid(value :any) :boolean {

    return validateUUID(value);
  }

  static addKeysToArray(oldArray) {
    const newArray = [];
    if (oldArray.length > 0) {
      oldArray.forEach((item) => {
        const newItem = item;
        if (item.key !== undefined) {
          newItem.primaryKey = item.key;
        }
        newItem.key = oldArray.indexOf(item);
        newArray.push(newItem);
      });
    }
    return newArray;
  }

  static loadUnusedPairs(allProps, properties) {
    const resultMap = Object.assign({}, allProps);
    properties.forEach((prop) => {
      if (!resultMap[prop.type.namespace]) return;
      const filteredNamespaceList = resultMap[prop.type.namespace].filter((propObj) => {
        return (propObj.id !== prop.id);
      });
      resultMap[prop.type.namespace] = filteredNamespaceList;
    });
    return resultMap;
  }

  static getFqnObj(namespace, name) {
    return { namespace, name };
  }

  static isValidEmail(email) {
    // http://stackoverflow.com/a/46181/196921
    /* eslint-disable max-len, no-useless-escape */
    const emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    /* eslint-enable */
    return emailRegex.test(email);
  }
}
