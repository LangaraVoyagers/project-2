import { IHarvestLog } from "project-2-types/lib/harvestLog";
import axios from "./axios";
import endpoints from "./endpoints";

export const getHarvestLogs = async () => {
  try {
    const {
      data: { data },
    } 
    = await axios.get(endpoints.harvestLogs);


    if (typeof data === "object") {
      return data as Array<IHarvestLog>;
    }
    return [];
  } catch (error) {
    console.log({ error });
    throw error;
  }
};