export const randomRotation = () => {
  return [
    Math.random() * Math.PI,
    Math.random() * Math.PI,
    Math.random() * Math.PI,
  ];
};

export const randomVelocity = () => {
  return [Math.random() * 3, Math.random() * 3, Math.random() * 3];
};

export const randomAngularVelocity = () => {
  return [
    Math.random() * 20 - 10,
    Math.random() * 20 - 10,
    Math.random() * 20 - 10,
  ];
};
