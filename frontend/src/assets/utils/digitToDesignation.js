import { useLanguage } from "../locale/LanguageContext";

export default function digitToDesignation(label, value) {
  const { translate } = useLanguage();

  if (label === "role_id") {
    switch (value) {
      case "admin":
        return translate("admin");
      case "national":
        return translate("NATIONAL");
      case "wilaya":
        return translate("WILAYA");
      case "baladi":
        return translate("BALADI");
      case "joiner":
        return translate("JOINER");
      case "printer":
        return translate("PRINTER");
      default:
        return value || "";
    }
  }
  return "";
}
