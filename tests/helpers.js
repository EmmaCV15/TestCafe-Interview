const numIterable = (num) => {
  const result = [];

  for (let i = 0; i < num; i++) {
    result.push(i);
  }

  return result;
};

const getDevices = async (selector) => {
  const devicesUI = selector(".list-devices");

  const devicesCount = await devicesUI.childElementCount;

  return { devicesUI, devicesCount };
};

const verifyData = async (test, device, index, action, value) => {
  await test.expect(device.child(index)[action]).eql(value);
};

const getDevicesFromAPI = async (test) => {
  let { body: devicesFromBack } = await test.request({
    url: "http://localhost:3000/devices",
    method: "GET",
  });

  //sort by capacity as in the UI
  return devicesFromBack.sort((a, b) => a.hdd_capacity - b.hdd_capacity);
};

const deleteDeviceFromAPI = async (test, id) => {
  const { status } = await test.request({
    url: `http://localhost:3000/devices/${id}`,
    method: "DELETE",
  });

  await test.expect(status).eql(200);
};

const validObjects = (obj1, obj2) => {
  let result = true;
  Object.keys(obj1).forEach((property) => {
    if (obj1[property] !== obj2[property] && property !== "id") result = false;
  });
  return result;
};

const validateChildrens = async (
  devicesFromBack,
  devicesUI,
  deviceIndex,
  t
) => {
  const device = devicesUI.child(deviceIndex);
  const deviceInfo = device.child(0);

  const { id, system_name, type, hdd_capacity } = devicesFromBack[deviceIndex];

  //Verify the data
  await verifyData(t, deviceInfo, 0, "innerText", system_name);
  await verifyData(t, deviceInfo, 1, "innerText", type);
  await verifyData(t, deviceInfo, 2, "innerText", `${hdd_capacity} GB`);

  const deviceOptions = device.child(1);

  //Verify the actions
  await verifyData(t, deviceOptions, 0, "attributes", {
    class: "device-edit",
    href: `/devices/edit/${id}`,
  });
  await verifyData(t, deviceOptions, 1, "attributes", {
    class: "device-remove",
  });
};

module.exports = {
  numIterable,
  getDevices,
  verifyData,
  getDevicesFromAPI,
  validObjects,
  validateChildrens,
  deleteDeviceFromAPI,
};
