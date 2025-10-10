export type DateContextType = {
  addDate: (date: number) => void;
  editDate: (oldDate: number, newDate: number) => void;
  deleteDate: (date: number) => void;
};
