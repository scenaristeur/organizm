const before_create_test = function () {
  console.log("this is before create function");
  return "ready";
};

const config = {
  _before_create: before_create_test,
  type: "Remote_Organizm",
};
