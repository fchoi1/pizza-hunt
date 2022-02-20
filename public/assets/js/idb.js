//db object
let db;

// establish a connection to IndexedDB database called 'pizza_hunt' and set it to version 1
const request = indexedDB.open('pizza_hunt', 1);

// this event will emit if the database version changes (nonexistant to version 1, v1 to v2, etc.)
request.onupgradeneeded = function (event) {
  //save a ref to database;
  db = event.target.result;
  // Create an object store (Table) call 'new_pizza' set it to have autoincrement primary key
  db.createObjectStore('new_pizza', { autoIncrement: true });
};

request.onsuccess = function (event) {
  // when db is successfully created with its object store (from onupgradedneeded event above) or simply established a connection, save reference to db in global variable
  console.log('db created');
  db = event.target.result;

  // check if app is online, if yes run uploadPizza() function to send all local db data to api
  if (navigator.onLine) {
    // we haven't created this yet, but we will soon, so let's comment it out for now
    uploadPizza();
  }
};

request.onerror = function (event) {
  // log error here
  console.log(event.target.errorCode);
};

const saveRecord = (record) => {
  // open a new transaction with the database with read and write permissions
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  // access the object store for 'new pizza'
  const pizzaObjectstore = transaction.objectStore('new_pizza');
  // add record to store

  pizzaObjectstore.add(record);
};

function promiseReq(req) {
  return new Promise((resolve, reject) => {
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

const uploadPizza = () => {
  // open a transaction on your db
  const transaction = db.transaction(['new_pizza'], 'readwrite');

  // access your object store
  const pizzaObjectStore = transaction.objectStore('new_pizza');

  // get all records from store and set to a variable
  const getAll = pizzaObjectStore.getAll();

  getAll.onsuccess = async function () {
    // if there was data in indexedDb's store, let's send it to the api server
    if (getAll.result.length > 0) {
      // fetch('/api/pizzas', {
      //   method: 'POST',
      //   body: JSON.stringify(getAll.result),
      //   headers: {
      //     Accept: 'application/json, text/plain, */*',
      //     'Content-Type': 'application/json'
      //   }
      // })
      //   .then((response) => response.json())
      //   .then((serverResponse) => {
      //     if (serverResponse.message) {
      //       throw new Error(serverResponse);
      //     }
      //     // open one more transaction
      //     const transaction = db.transaction(['new_pizza'], 'readwrite');
      //     // access the new_pizza object store
      //     const pizzaObjectStore = transaction.objectStore('new_pizza');
      //     // clear all items in your store
      //     pizzaObjectStore.clear();

      //     alert('All saved pizza has been submitted!');
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
      try {
        const response = await fetch('/api/pizzas', {
          method: 'POST',
          body: JSON.stringify(getAll.result),
          headers: {
            Accept: 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          }
        });
        const serverResponse = await response.json();

        if (serverResponse.message) {
          throw new Error(serverResponse);
        }
        // open one more transaction
        const transaction = db.transaction(['new_pizza'], 'readwrite');
        // access the new_pizza object store
        const pizzaObjectStore = transaction.objectStore('new_pizza');
        // clear all items in your store
        pizzaObjectStore.clear();

        alert('All saved pizza has been submitted!');
      } catch (err) {
        console.log(err);
      }
    }
  };
};

// Check if back online
window.addEventListener('online', uploadPizza);
