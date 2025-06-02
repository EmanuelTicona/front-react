import { useQuery } from "@tanstack/react-query";
import { getWorkNotes } from "../api/work_note";


export const useWorkNotesList = () => {
    return useQuery({
        queryKey: ['work-notes-list'],
        queryFn: getWorkNotes,
    });
};