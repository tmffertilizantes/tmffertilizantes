import LayoutDefault from "@components/Layouts/default";
import { PostType } from "@components/postType";
import { DateColumnFilter, NoFilter } from "@components/Table";
import EditButton from "@components/Utils/Buttons/EditButton";
import RemoveButton from "@components/Utils/Buttons/RemoveButton";
import StatusButton from "@components/Utils/Buttons/StatusButton";
import SelectLanguage from "@components/Utils/SelectLanguage";
import { useGlobal } from "@context/global";
import axios, { AxiosResponse } from "axios";
import { ColumnFn } from "models/ColumnFn";
import React, { useMemo, useState } from "react";
import Select from "react-select";
import useSWR from "swr";

interface CustomComponent {
  post: any;
  setPost: Function;
}

const fetcherCategories = (url = "", token = "") =>
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data.categorys);

export default function Produtos() {
  const { token = "" } = useGlobal();
  const url = `${process.env.API_URL}/product`;

  const [language, setLanguage] = useState("pt-br");

  const [csvData, setCsvData] = useState(null);

  interface MineralName {
    name: "ca" | "si";
  }

  var minerals_obj = {
    ca: "",
    si: "",
    mg: "",
    b: "",
    s: "",
    n: "",
  };

  function changeMineral(
    value: any,
    name: "ca" | "si" | "mg" | "b" | "s" | "n",
    post: any,
    setPost: Function
  ) {
    if (post.minerals) {
      minerals_obj = post.minerals;
    }

    if (typeof minerals_obj !== "object") {
      minerals_obj = JSON.parse(minerals_obj);
    }

    minerals_obj[name] = value;

    setPost((post: any) => ({
      ...post,
      minerals: JSON.stringify(minerals_obj),
    }));
  }

  function getPostMineral(
    post: any,
    mineral_name: "ca" | "si" | "mg" | "b" | "s" | "n"
  ) {
    if (post.minerals) {
      if (typeof post.minerals !== "object") {
        try {
          var new_obj = JSON.parse(post.minerals);

          if (new_obj[mineral_name]) {
            return new_obj[mineral_name];
          }
        } catch (e) {
          return "";
        }
      } else {
        if (post.minerals[mineral_name]) {
          return post.minerals[mineral_name];
        }
      }
    }

    if (minerals_obj[mineral_name]) {
      return minerals_obj[mineral_name];
    }

    return "";
  }

  const fields = [
    {
      field: "name",
      label: "Nome",
      placeholder: "Exemplo",
      customEvents: (setCategoria: (arg0: (categoria: any) => any) => any) => ({
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setCategoria((categoria) => ({
            ...categoria,
            name: e.target.value,
            slug: e.target.value
              .toLowerCase()
              .replace(/ /g, "_")
              .replace(/[^\w-]+/g, ""),
          })),
      }),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div>
          <SelectLanguage
            className="mb-4"
            value={post.lang ? post.lang : language}
            onChange={(event) => {
              setLanguage(event.target.value);
              setPost({ ...post, lang: event.target.value });
            }}
          />
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div>
          <label className="form-label">Categoria</label>

          <Select
            value={categories_as_options.find(
              (category: any) => category.value === post.categoryId
            )}
            placeholder="Selecione a categoria..."
            classNamePrefix="select"
            className="mb-4"
            options={categories_as_options}
            onChange={(newValue: any) => {
              setPost({
                ...post,
                categoryId: newValue.value,
              });
            }}
          />
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          <label className="form-label" htmlFor="parameter">
            Parâmetro
          </label>

          <input
            defaultValue={post.parameter}
            onChange={function (e) {
              setPost({
                ...post,
                parameter: parseInt(e.target.value),
              });
            }}
            type="number"
            step="1"
            id="parameter"
            className="form-control"
            placeholder="230"
          />
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div>
          <div className="mb-3">
            <label className="form-label" htmlFor="minerals.ca">
              Cálcio
            </label>

            <input
              defaultValue={getPostMineral(post, "ca")}
              onChange={function (e) {
                changeMineral(e.target.value, "ca", post, setPost);
              }}
              type="number"
              step="0.01"
              id="minerals.ca"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="minerals.si">
              Silício
            </label>

            <input
              defaultValue={getPostMineral(post, "si")}
              onChange={function (e) {
                changeMineral(e.target.value, "si", post, setPost);
              }}
              type="number"
              step="0.01"
              id="minerals.si"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="minerals.mg">
              Magnésio
            </label>

            <input
              defaultValue={getPostMineral(post, "mg")}
              onChange={function (e) {
                changeMineral(e.target.value, "mg", post, setPost);
              }}
              type="number"
              step="0.01"
              id="minerals.mg"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="minerals.b">
              Boro
            </label>

            <input
              defaultValue={getPostMineral(post, "b")}
              onChange={function (e) {
                changeMineral(e.target.value, "b", post, setPost);
              }}
              type="number"
              step="0.01"
              id="minerals.b"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="minerals.s">
              Enxofre
            </label>

            <input
              defaultValue={getPostMineral(post, "s")}
              onChange={function (e) {
                changeMineral(e.target.value, "s", post, setPost);
              }}
              type="number"
              step="0.01"
              id="minerals.s"
              className="form-control"
            />
          </div>

          <div className="mb-3">
            <label className="form-label" htmlFor="minerals.n">
              Nitrogênio
            </label>

            <input
              defaultValue={getPostMineral(post, "n")}
              onChange={function (e) {
                changeMineral(e.target.value, "n", post, setPost);
              }}
              type="number"
              step="0.01"
              id="minerals.n"
              className="form-control"
            />
          </div>
        </div>
      ),
    },
  ];

  const { data: categories, error } = useSWR(
    [`${process.env.API_URL}/category`, token],
    fetcherCategories
  );

  const categories_as_options = useMemo(
    () =>
      categories?.map((category: { id: any; name: any }) => ({
        value: category.id,
        label: category.name,
      })) || [],
    [categories]
  );

  const colunas =
    ({ onUpdate, onRemove, getPost, onStatusChange }: ColumnFn) =>
    () =>
      [
        {
          Header: "Name",
          accessor: "name",
        },
        {
          Header: "Criado Em",
          accessor: "createdAt",
          Filter: DateColumnFilter,
          filter: "dateBetween",
          Cell: ({ value = new Date() }) => (
            <span>{new Date(value).toLocaleDateString()}</span>
          ),
        },
        {
          Header: "",
          accessor: "id",
          Filter: NoFilter,
          Cell: ({ value = "" }) => {
            const currentPost = getPost(value);
            return (
              <div className="text-end">
                <EditButton className="me-2" onClick={() => onUpdate(value)} />

                {currentPost && (
                  <StatusButton
                    active={currentPost["active"]}
                    onClick={() => onStatusChange(value, currentPost["active"])}
                  />
                )}
              </div>
            );
          },
        },
      ];

  const initialData = useMemo(() => {
    let data = null;

    data = {
      active: true,
    };

    if (categories_as_options && categories_as_options.length) {
      data = {
        ...data,
        categoryId: categories_as_options[0].value,
      };
    }

    if (language) {
      data = {
        ...data,
        lang: language,
      };
    }

    return data;
  }, [categories_as_options]);

  return (
    <LayoutDefault>
      <PostType
        initialPostData={initialData}
        csvData={csvData}
        dataConfig={{
          url,
          token,
          updateFn: async (
            updateUrl = "",
            url = "",
            options = {},
            post = { category: {} },
            fetcherDataFn = (result: any) => {}
          ) => {
            // @ts-expect-error
            delete post.category;

            await axios.patch(updateUrl, post, options);
            const result = await axios.get(url, options);

            return fetcherDataFn(result);
          },
          fetcherFn: (fetcherDataFn = () => {}, url = "", options = {}) =>
            axios
              .get(
                `${process.env.API_URL}/product?includes=category,analysis`,
                options
              )
              .then(fetcherDataFn),
          fetcherDataFn: (response: AxiosResponse) => {
            const products = response.data.products;

            var data_for_csv = products.map((product: any) => {
              return {
                ...product,
                minerals: "-",
                category: product.category?.name ?? "",
                calcio: getPostMineral(product, "ca"),
                silicio: getPostMineral(product, "si"),
                magnesio: getPostMineral(product, "mg"),
                boro: getPostMineral(product, "b"),
                enxofre: getPostMineral(product, "s"),
                nitrogenio: getPostMineral(product, "n"),
              };
            });

            setCsvData(data_for_csv);

            return products;
          },
        }}
        formConfig={{
          insertTitle: "Adicionar Produto",
          editTitle: "Editar Produto",
          fields,
        }}
        tableConfig={{
          columnsFn: colunas,
        }}
        pageConfig={{
          pageTitle: "Produtos",
        }}
      />
    </LayoutDefault>
  );
}
