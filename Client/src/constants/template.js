// 2D Dieline components (each one has .defaultDimensions attached)
import Fefco0201Dieline from "../components/dieline/Fefco0201";
import Fefco0203Dieline from "../components/dieline/Fefco0203";
import Fefco0301Dieline from "../components/dieline/Fefco0301";
import Fefco0401Dieline from "../components/dieline/Fefco0401";
import Fefco0427Dieline from "../components/dieline/Fefco0427";

/**
 * TEMPLATE_CONFIG
 * - single registry for all templates
 * - DOES NOT hard-code dimensions
 * - reads defaultDimensions from dieline component itself
 */
export const TEMPLATE_CONFIG = {
  "0201": {
    id: "0201",
    code: "FEFCO 0201",
    name: "FEFCO 0201",
    Dieline2D: Fefco0201Dieline,
    defaultDimensions: Fefco0201Dieline.defaultDimensions,
  },

  "0203": {
    id: "0203",
    code: "FEFCO 0203",
    name: "FEFCO 0203",
    Dieline2D: Fefco0203Dieline,
    defaultDimensions: Fefco0203Dieline.defaultDimensions,
  },

  "0301": {
    id: "0301",
    code: "FEFCO 0301",
    name: "FEFCO 0301",
    Dieline2D: Fefco0301Dieline,
    defaultDimensions: Fefco0301Dieline.defaultDimensions,
  },

  "0401": {
    id: "0401",
    code: "FEFCO 0401",
    name: "FEFCO 0401",
    Dieline2D: Fefco0401Dieline,
    defaultDimensions: Fefco0401Dieline.defaultDimensions,
  },

  "0427": {
    id: "0427",
    code: "FEFCO 0427",
    name: "FEFCO 0427",
    Dieline2D: Fefco0427Dieline,
    defaultDimensions: Fefco0427Dieline.defaultDimensions,
  },
};
