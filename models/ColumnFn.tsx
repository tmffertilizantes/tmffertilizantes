export interface ColumnFn {
  onUpdate: Function;
  onTrash: Function;
  onRemove: Function;
  onStatusChange: Function;
  getPost: Function;
  reloadData: Function;
}
