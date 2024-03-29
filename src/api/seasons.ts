import {
  ISeasonResponse,
  ISeasonRequest,
  StatusEnum,
} from "project-2-types/dist/interface";
import axios from "./axios";
import endpoints from "./endpoints";

export const getSeasons = async (params?: { status?: keyof typeof StatusEnum }) => {
  try {
    const {
      data: { data },
    } = await axios.get(endpoints.seasons, { params });

    if (typeof data === "object") {
      return data as Array<ISeasonResponse>;
    }
    return [];
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const getSeasonById = async (id?: string) => {
  try {
    const {
      data: { data },
    } = await axios.get(`${endpoints.seasons}/${id}`);
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const upsertSeason = async ({
  seasonId,
  ...payload
}: ISeasonRequest & { seasonId?: string }) => {
  try {
    if (seasonId) {
      const {
        data: { data },
      } = await axios.put(`${endpoints.seasons}/${seasonId}`, payload);
      return data;
    }
    const {
      data: { data },
    } = await axios.post(endpoints.seasons, payload);
    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const deleteSeason = async (seasonId?: string) => {
  try {
    const {
      data: { data },
    } = await axios.delete(`${endpoints.seasons}/${seasonId}`);

    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};

export const closeSeason = async (seasonId?: string) => {
  try {
    const {
      data: { data },
    } = await axios.put(`${endpoints.seasons}/${seasonId}/close`);

    return data;
  } catch (error) {
    console.log({ error });
    throw error;
  }
};
