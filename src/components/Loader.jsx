import { motion } from "framer-motion";

const Loader = () => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{
          width: "50px",
          height: "50px",
          border: "5px solid red",
          borderTop: "5px solid transparent",
          borderRadius: "50%",
        }}
      />
    </div>
  );
};

export default Loader;
