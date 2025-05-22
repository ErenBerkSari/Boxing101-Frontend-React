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
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 360],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            width: "60px",
            height: "60px",
            border: "4px solid #f3f3f3",
            borderTop: "4px solid #ff4d4d",
            borderRight: "4px solid #ff4d4d",
            borderRadius: "50%",
            boxShadow: "0 0 20px rgba(255, 77, 77, 0.2)",
          }}
        />
        <motion.div
          animate={{
            opacity: [0.5, 1, 0.5],
          }}
          transition={{
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{
            color: "#333",
            fontSize: "16px",
            fontWeight: "500",
          }}
        >
          Yükleniyor...
        </motion.div>
      </motion.div>
    </div>
  );
};

export default Loader;
