import { WorkNote } from './../interfaces/work_note/work_note.interface';
import axios from "axios";
import { API_URL } from "../services";

export const getWorkNotes = async (): Promise<WorkNote[]> => {
    const response = await axios.get(API_URL + 'api/data/work_notes');
    return response.data;
};