// Status configurations for different entities
export const getStatusConfig = (status, type = "") => {
  const configs = {
    // Add more entity types here as needed
    user: {
      admin: {
        color: "#27ae60",
        bg: "rgba(46, 204, 113, 0.15)",
        text: "admin",
      },
      national: {
        color: "#27ae60",
        bg: "rgba(46, 204, 113, 0.15)",
        text: "national",
      },
      wilaya: {
        color: "#1890ff",
        bg: "rgba(24, 144, 255, 0.15)",
        text: "wilaya",
      },
      baladi: {
        color: "#722ed1",
        bg: "rgba(114, 46, 209, 0.15)",
        text: "baladi",
      },
      joiner: {
        color: "#faad14",
        bg: "rgba(250, 173, 20, 0.15)",
        text: "JOINER",
      },
      printer: {
        color: "#fa541c",
        bg: "rgba(250, 84, 28, 0.15)",
        text: "printer",
      },
      manager: {
        color: "#95a5a6",
        bg: "rgba(149, 165, 166, 0.15)",
        text: "manager",
      },
      administrator: {
        color: "#27ae60",
        bg: "rgba(46, 204, 113, 0.15)",
        text: "admin",
      },
    },

    // Stock status configurations
    stock: {
      0: {
        color: "#27ae60",
        bg: "rgba(46, 204, 113, 0.15)",
        text: "good_state",
      },
      1: {
        color: "#f39c12",
        bg: "rgba(243, 156, 18, 0.15)",
        text: "repairable_state",
      },
      2: {
        color: "#e74c3c",
        bg: "rgba(231, 76, 60, 0.15)",
        text: "damaged_state",
      },
    },

    // Production status configurations
    production: {
      0: {
        color: "#27ae60",
        bg: "rgba(46, 204, 113, 0.15)",
        text: "good_state",
      },
      1: {
        color: "#f39c12",
        bg: "rgba(243, 156, 18, 0.15)",
        text: "repairable_state",
      },
      2: {
        color: "#e74c3c",
        bg: "rgba(231, 76, 60, 0.15)",
        text: "damaged_state",
      },
    },

    // Check-in/out status configurations
    check_in_out: {
      check_in: {
        color: "#52c41a",
        bg: "rgba(82, 196, 26, 0.15)",
        text: "check_in",
        icon: "LoginOutlined",
      },
      check_out: {
        color: "#ff4d4f",
        bg: "rgba(255, 77, 79, 0.15)",
        text: "check_out",
        icon: "LogoutOutlined",
      },
    },
    // Joiner (Member) status configurations
    joiner: {
      0: {
        color: "#faad14",
        bg: "rgba(250, 173, 20, 0.15)",
        text: "pending_approval",
      },
      1: {
        color: "#52c41a",
        bg: "rgba(82, 196, 26, 0.15)",
        text: "enabled",
      },
    },
  };

  const normalizedStatus = status?.toString()?.toLowerCase();
  const typeConfig = configs[type] || configs.user;
  return (
    typeConfig[normalizedStatus] || {
      color: "#95a5a6",
      bg: "rgba(149, 165, 166, 0.15)",
      icon: null,
      text: status,
    }
  );
};
