const { Selector, t } = require("testcafe");
const {
  getDevices,
  numIterable,
  getDevicesFromAPI,
  deleteDeviceFromAPI,
  validObjects,
  validateChildrens,
} = require("./helpers");
const InputPage = require("./pageObjects/inputPage");

fixture`Group of tests / Test suite - Devices Suite`.page`./`;

test("Should get devices from api and verify the UI ", async (t) => {
  const devicesFromBack = await getDevicesFromAPI(t);

  await t.expect(Array.isArray(devicesFromBack)).ok();

  const { devicesUI, devicesCount } = await getDevices(Selector);

  await t.expect(devicesCount).eql(devicesFromBack.length);

  //create new num iterable to use for await to resolve the promises without errors.
  for await (let i of numIterable(devicesCount)) {
    validateChildrens(devicesFromBack, devicesUI, i, t);
  }
});

test("Should create new device from UI", async (t) => {
  let { devicesCount } = await getDevices(Selector);

  const objectToValidate = {
    system_name: "Mac edgar",
    hdd_capacity: "5",
    type: "WINDOWS_WORKSTATION",
  };

  await InputPage.create(
    objectToValidate.system_name,
    objectToValidate.hdd_capacity
  );

  const { devicesUI, devicesCount: newDevicesCount } = await getDevices(
    Selector
  );

  await t.expect(newDevicesCount).gt(devicesCount);

  const devicesFromBack = await getDevicesFromAPI(t);

  objectToValidate.type = objectToValidate.type.replace("_", " ");

  const deviceIndex = devicesFromBack.findIndex((dev) =>
    validObjects(dev, objectToValidate)
  );

  validateChildrens(devicesFromBack, devicesUI, deviceIndex, t);
});

test("Should update new device from UI", async (t) => {
  let { devicesCount } = await getDevices(Selector);

  const objectToValidate = {
    system_name: "Windows Form",
    hdd_capacity: "2",
    type: "WINDOWS WORKSTATION",
  };

  await InputPage.update(
    objectToValidate.system_name,
    objectToValidate.type,
    objectToValidate.hdd_capacity
  );

  const { devicesUI, devicesCount: newDevicesCount } = await getDevices(
    Selector
  );

  await t.expect(newDevicesCount).eql(devicesCount);

  const devicesFromBack = await getDevicesFromAPI(t);

  const deviceIndex = devicesFromBack.findIndex((dev) =>
    validObjects(dev, objectToValidate)
  );

  validateChildrens(devicesFromBack, devicesUI, deviceIndex, t);
});

test("Should delete device from API", async () => {
  const devicesFromBack = await getDevicesFromAPI(t);

  await deleteDeviceFromAPI(t, devicesFromBack[0].id);

  await t.eval(() => location.reload(true));

  const { devicesCount } = await getDevices(Selector);

  await t.expect(devicesCount).notEql(devicesFromBack.length);
});
