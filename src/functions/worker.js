/* eslint-disable no-restricted-globals */
self.onmessage = (e) => {
  const file = e.data;
  console.log("window onmessage", file);

  const reader = new FileReader();

  reader.onload = () => {
    const content = reader.result;
    console.log(content);
    postMessage(content);
  };

  reader.readAsText(file);
};
