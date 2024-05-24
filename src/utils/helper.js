import axios from 'axios';
import SyncStorage from 'sync-storage';
export const URL = 'https://demo1-ravendel.hbwebsol.com/';
// export const BASE_URL = 'https://demo1-ravendel.hbwebsol.com/';
export const BASE_URL = 'http://192.168.1.30:8000/';

export const deleteProductVariation = id => {
  const token = SyncStorage.get('token') || '';
  return axios
    .post(
      `${BASE_URL}apis/misc/delete_variation`,
      {
        id: id,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then(function (response) {
      if (response.data.success) {
        return Promise.resolve(true);
      }
    });
};

export const allPossibleCases = arr => {
  if (arr.length === 1) {
    let comb = [];
    for (const i of arr[0]) {
      comb.push([i]);
    }

    return comb;
  } else {
    var result = [];
    var allCasesOfRest = allPossibleCases(arr.slice(1)); // recur with the rest of array
    for (var i = 0; i < allCasesOfRest.length; i++) {
      for (var j = 0; j < arr[0].length; j++) {
        let comb = [];
        comb.push(arr[0][j]);
        if (Array.isArray(allCasesOfRest[i])) {
          for (const k of allCasesOfRest[i]) {
            comb.push(k);
          }
        } else {
          comb.push(allCasesOfRest[i]);
        }
        result.push(comb);
      }
    }
    return result;
  }
};

export const unflatten = arr => {
  var tree = [],
    mappedArr = {},
    arrElem,
    mappedElem;

  // First map the nodes of the array to an object -> create a hash table.
  for (var i = 0, len = arr.length; i < len; i++) {
    arrElem = arr[i];
    mappedArr[arrElem.id] = arrElem;
    mappedArr[arrElem.id]['children'] = [];
  }

  for (var id in mappedArr) {
    if (mappedArr.hasOwnProperty(id)) {
      mappedElem = mappedArr[id];
      // If the element is not at the root level, add it to its parent array of children.

      if (mappedElem.parentId && mappedArr[mappedElem['parentId']]) {
        mappedArr[mappedElem['parentId']]['children'].push(mappedElem);
      }
      // If the element is at the root level, add it to first level elements array.
      else {
        tree.push(mappedElem);
      }
    }
  }
  return tree;
};

export const isEmpty = value =>
  value === undefined ||
  value === null ||
  (typeof value === 'object' && Object.keys(value).length === 0) ||
  (typeof value === 'string' && value.trim().length === 0);

export const getUpdatedUrl = async (table, url) => {
  const token = SyncStorage.get('token') || '';
  return axios
    .post(
      `${BASE_URL}apis/misc/checkurl`,
      {
        url: url,
        table: table,
      },
      {
        headers: {
          Authorization: token,
        },
      },
    )
    .then(function (response) {
      if (response.data.success) {
        return Promise.resolve(response.data.url);
      }
    });
};

export const containsOnlyNumbers = input => {
  // Regular expression to match numbers with optional decimal point
  var numberPattern = /^\d*\.?\d+$/;

  // Test if the input matches the number pattern
  return numberPattern.test(input);
};

export const convertData = data => {
  const result = [];

  // Create an object to store groups and their corresponding attributes
  const groups = {};

  // Iterate through the data
  data.forEach(item => {
    // Check if the group already exists in the groups object
    if (!groups[item.group]) {
      // If the group doesn't exist, create a new entry in the groups object
      groups[item.group] = {
        name: item.group,
        attributes: [{key: item.key, value: item.value}],
      };
    } else {
      // If the group exists, push the attribute to the existing group
      groups[item.group].attributes.push({key: item.key, value: item.value});
    }
  });

  // Convert the groups object to an array of values
  for (const groupName in groups) {
    result.push(groups[groupName]);
  }

  return result;
};

export const getDiscount = (price, salePrice) => {
  return Math.floor(((price - salePrice) * 100) / price).toFixed(0);
};

export const wait = timeout => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
  } catch (e) {
    // saving error
  }
};

export const formatCurrency = (amt, currencyOptions, currencySymbol) => {
  if (!amt || !currencyOptions || !currencySymbol) {
    return '';
  }
  var amount = parseFloat(amt);
  if (currencyOptions && currencySymbol) {
    let postion = currencyOptions.currency_position;
    let decimal = currencyOptions.number_of_decimals || 2;
    return `${
      postion == 'left' || postion === 'left_space' ? currencySymbol : ''
    }${amount.toFixed(decimal)}${
      postion == 'right' || postion === 'right_space' ? currencySymbol : ''
    }`;
  } else {
    return `$${amount}`;
  }
};

export const getCheckedIds = data => {
  const checkedIds = [];

  function checkNode(node) {
    if (node?.checked || hasCheckedChild(node)) {
      checkedIds.push(node.id);
    }
    if (node?.children && node?.children?.length > 0) {
      node?.children?.forEach(child => checkNode(child));
    }
  }

  data?.forEach(checkNode);
  return checkedIds;
};
export const hasCheckedChild = cat => {
  if (cat?.checked) {
    return true;
  }
  if (cat?.children && Array.isArray(cat?.children)) {
    for (const child of cat?.children) {
      if (hasCheckedChild(child)) {
        return true;
      }
    }
  }
  return false;
};
