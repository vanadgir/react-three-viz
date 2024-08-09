import styles from "./Slider.module.scss";

const Slider = ({ className, label, max, update, value }) => {
  return (
    <div className={`${styles.slider} ${className}`}>
      <p>{label}</p>
      <input
        className={className}
        type="range"
        min="0.5"
        step="0.1"
        max={max}
        onChange={(e) => update(parseFloat(e.target.value))}
        value={value}
      />
    </div>
  );
};

export default Slider;
