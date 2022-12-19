import { parseCookies, setCookie } from "nookies";
import React from "react";
import { Col, Dropdown, Form, Row } from "react-bootstrap";
import {
  useTable,
  useFilters,
  useGlobalFilter,
  useAsyncDebounce,
  useSortBy,
  Column,
  usePagination,
} from "react-table";
import moment from "moment";
import uuid from "react-uuid";

function GlobalFilter({
  preGlobalFilteredRows,
  globalFilter,
  setGlobalFilter,
}: any) {
  const count = preGlobalFilteredRows.length;
  const [value, setValue] = React.useState(globalFilter);
  const onChange = useAsyncDebounce((value) => {
    setGlobalFilter(value || undefined);
  }, 200);

  return (
    <div className="SearchBar mb-4 d-flex align-items-center">
      <span className="position-absolute ps-3 search-icon">
        <i className="fe fe-search"></i>
      </span>
      <input
        className="form-control form-control-sm ps-6"
        placeholder="Pesquisar"
        value={value || ""}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        style={{
          border: "0",
        }}
      />
    </div>
  );
}

export const NoFilter = () => {
  return <></>;
};

function DefaultColumnFilter({
  column: { filterValue, preFilteredRows, setFilter },
}: any) {
  const count = preFilteredRows.length;

  return (
    <div className="SearchBar SearchBar--secondary position-relative mt-1 d-flex align-items-center">
      <span className="position-absolute search-icon h-100 px-1 d-flex align-items-center">
        <i className="fe fe-search"></i>
      </span>
      <input
        className="form-control form-control-xs ps-5 py-1"
        placeholder="Buscar..."
        value={filterValue || ""}
        onChange={(e) => {
          setFilter(e.target.value || undefined); // Set undefined to remove the filter entirely
        }}
        style={{
          border: "0",
          lineHeight: 1.2,
          fontSize: 12,
        }}
      />
    </div>
  );
}

function dateBetweenFilterFn(
  rows: any[],
  id: string | number,
  filterValues: string | any[]
) {
  let start_date = moment(filterValues[0]).format();
  let end_date = moment(filterValues[1]).format();

  return rows.filter((r) => {
    var time = moment(r.values[id]).format();

    if (
      (filterValues[0] === undefined && filterValues[1] === undefined) ||
      filterValues.length === 0
    ) {
      return rows;
    }

    if (filterValues[0] !== undefined && filterValues[1] !== undefined) {
      return moment(time).isBetween(start_date, end_date, "days", "[]");
    }

    if (filterValues[0] === undefined) {
      return moment(time).isSameOrBefore(end_date, "days");
    }

    if (filterValues[1] === undefined) {
      return moment(time).isSameOrAfter(start_date, "days");
    }

    return rows;
  });
}

dateBetweenFilterFn.autoRemove = (val: any) => !val;

export function DateColumnFilter({
  column: { filterValue = [], preFilteredRows, setFilter, id },
}: any) {
  const [min, max] = React.useMemo(() => {
    let min: Date = new Date("2000-01-01");
    let max: Date = new Date("2000-01-01");

    if (preFilteredRows.length > 0) {
      min = new Date(preFilteredRows[0].values[id]);
      max = new Date(preFilteredRows[0].values[id]);

      preFilteredRows.forEach(
        (row: { values: { [x: string]: string | number | Date } }) => {
          min =
            new Date(row.values[id]) <= min ? new Date(row.values[id]) : min;
          max =
            new Date(row.values[id]) >= max ? new Date(row.values[id]) : max;
        }
      );
    }

    return [min, max];
  }, [id, preFilteredRows]);

  if (preFilteredRows.length > 0) {
    return (
      <div className="SearchBar SearchBar--secondary position-relative mt-1 d-flex align-items-center">
        <Row className="gy-2">
          <Col>
            <div className="position-relative">
              <span className="position-absolute search-icon h-100 px-1 d-flex align-items-center">
                <i className="fe fe-search"></i>
              </span>

              <input
                className="form-control-xs ps-5 py-1 input-light"
                type="date"
                min={min.toISOString().slice(0, 10)}
                max={max.toISOString().slice(0, 10)}
                value={filterValue[0] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilter((old = []) => [val ? val : undefined, old[1]]);
                }}
                style={{
                  border: "0",
                  lineHeight: 1.2,
                  fontSize: 12,
                }}
              />
            </div>
          </Col>
          <Col>
            <div className="position-relative">
              <span className="position-absolute search-icon h-100 px-1 d-flex align-items-center">
                <i className="fe fe-search"></i>
              </span>

              <input
                className="form-control-xs ps-5 py-1 input-light"
                type="date"
                min={min.toISOString().slice(0, 10)}
                max={max.toISOString().slice(0, 10)}
                value={filterValue[1] || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setFilter((old = []) => [old[0], val ? val : undefined]);
                }}
                style={{
                  border: "0",
                  lineHeight: 1.2,
                  fontSize: 12,
                }}
              />
            </div>
          </Col>
        </Row>
      </div>
    );
  } else {
    return (
      <div className="SearchBar SearchBar--secondary position-relative mt-1 d-flex align-items-center">
        <Row>
          <Col>
            <span className="position-absolute search-icon h-100 px-1 d-flex align-items-center">
              <i className="fe fe-search"></i>
            </span>

            <input
              className="form-control-xs ps-5 py-1 input-light"
              type="date"
              value={""}
              style={{
                border: "0",
                lineHeight: 1.2,
                fontSize: 12,
              }}
            />
          </Col>
          <Col>
            <span className="position-absolute search-icon h-100 px-1 d-flex align-items-center">
              <i className="fe fe-search"></i>
            </span>

            <input
              className="form-control-xs ps-5 py-1 input-light"
              type="date"
              style={{
                border: "0",
                lineHeight: 1.2,
                fontSize: 12,
              }}
            />
          </Col>
        </Row>
      </div>
    );
  }
}

export const Table = ({
  columns = [],
  data = [],
  hooks = [],
}: {
  columns: Array<Column<object>>;
  data: Array<any>;
  hooks?: Array<any>;
}) => {
  const defaultColumn = React.useMemo(
    () => ({
      // Let's set up our default Filter UI
      Filter: DefaultColumnFilter,
    }),
    []
  );

  const cookies = parseCookies();

  var defaultPageSize = 25;

  if (cookies["items_to_show_on_table"]) {
    defaultPageSize = parseInt(cookies["items_to_show_on_table"]);
  }

  const filterTypes = React.useMemo(
    () => ({
      dateBetween: dateBetweenFilterFn /*<- LIKE THIS*/,
      text: (rows: any[], id: string | number, filterValue: any) => {
        return rows.filter((row) => {
          const rowValue = row.values[id];
          return rowValue !== undefined
            ? String(rowValue)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase())
            : true;
        });
      },
    }),
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
    pageOptions,
    pageCount,
    page,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    setPageSize,
    canPreviousPage,
    canNextPage,
    state,
    preGlobalFilteredRows,
    setGlobalFilter,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        pageSize: defaultPageSize,
      },
      defaultColumn,
      // @ts-ignore
      filterTypes,
    },
    useFilters,
    useGlobalFilter,
    useSortBy,
    usePagination,
    ...hooks
  );

  return (
    <div>
      <GlobalFilter
        preGlobalFilteredRows={preGlobalFilteredRows}
        globalFilter={state.globalFilter}
        setGlobalFilter={setGlobalFilter}
      />

      <div className="card">
        <table {...getTableProps()} className="table mb-0 text-nowrap">
          <thead className="table-light">
            {headerGroups.map((headerGroup) => {
              const { key, ...restHeaderProps } =
                headerGroup.getHeaderGroupProps();

              return (
                <tr {...restHeaderProps} key={key}>
                  {headerGroup.headers.map((column) => {
                    const { key, ...restColumnProps } = column.getHeaderProps();
                    return (
                      <th key={key} {...restColumnProps}>
                        {column.render("Header")}
                        <span>
                          {column.isSorted
                            ? column.isSortedDesc
                              ? " 🔽"
                              : " 🔼"
                            : ""}
                        </span>
                        {column.canFilter ? column.render("Filter") : null}
                      </th>
                    );
                  })}
                </tr>
              );
            })}
          </thead>

          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const { key, ...restRowProps } = row.getRowProps();

              return (
                <tr {...restRowProps} key={key}>
                  {row.cells.map((cell) => {
                    const { key, ...restCelProps } = cell.getCellProps();

                    return (
                      <td {...restCelProps} key={key} className="align-middle">
                        {cell.render("Cell")}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="container-fluid px-4 py-2">
        <div className="row">
          <div className="col">
            <div className="d-flex gap-2">
              <button
                className="btn btn-secondary btn-xs"
                onClick={() => gotoPage(0)}
                disabled={!canPreviousPage}
              >
                {"<<"}
              </button>
              <button
                className="btn btn-secondary btn-xs"
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
              >
                {"<"}
              </button>
              <button
                className="btn btn-secondary btn-xs"
                onClick={() => nextPage()}
                disabled={!canNextPage}
              >
                {">"}
              </button>
              <button
                className="btn btn-secondary btn-xs"
                onClick={() => gotoPage(pageCount - 1)}
                disabled={!canNextPage}
              >
                {">>"}
              </button>
            </div>
          </div>

          <div className="col text-center">
            Página{" "}
            <em>
              {pageIndex + 1} de {pageOptions.length}
            </em>
          </div>
          {/*
          <div>
            <div>Pular para a página:</div>
            <input
              type="number"
              defaultValue={pageIndex + 1 || 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />
          </div> */}

          <Dropdown className="col text-end">
            <Dropdown.Toggle
              className="btn-xs"
              variant="secondary"
              id="dropdown-basic"
            >
              Exibir {pageSize} itens
            </Dropdown.Toggle>

            <Dropdown.Menu>
              {[25, 50, 100].map((pageSize) => (
                <Dropdown.Item
                  key={pageSize}
                  onClick={() => {
                    setPageSize(pageSize);
                    setCookie(
                      null,
                      "items_to_show_on_table",
                      pageSize.toString(),
                      {
                        maxAge: 30 * 24 * 60 * 60,
                        path: "/",
                      }
                    );
                  }}
                >
                  {pageSize} itens
                </Dropdown.Item>
              ))}
            </Dropdown.Menu>
          </Dropdown>
        </div>
      </div>
    </div>
  );
};
