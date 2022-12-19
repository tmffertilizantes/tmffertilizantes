export interface ColumnFn {
  onUpdate: Function;
  onRemove: Function;
  onStatusChange: Function;
  getPost: Function;
  reloadData: Function;
}
