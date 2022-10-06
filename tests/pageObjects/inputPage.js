const { Selector, t } = require("testcafe");

class InputPaage {
  constructor() {
    this.systemName = Selector("#system_name");
    this.type = Selector("#type");
    this.hddCapacity = Selector("#hdd_capacity");
    this.submit = ".submitButton";
  }

  async create(system_name, hdd_capacity) {
    await t
      .click(this.submit)
      .typeText(this.systemName, system_name)
      .typeText(this.hddCapacity, hdd_capacity)
      .click(this.submit);
  }

  async update(system_name, type, hdd_capacity) {
    await t
      .click(Selector(".device-edit").nth(0))
      .typeText(this.systemName, system_name, { replace: true })
      .typeText(this.hddCapacity, hdd_capacity, {
        replace: true,
      })
      .click(this.type)
      .click(this.type.find("option").withText(type))
      .click(this.submit);
  }
}

module.exports = new InputPaage();
