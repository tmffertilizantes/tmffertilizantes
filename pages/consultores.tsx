import { AlertError, AlertItemEdited } from "@components/Alerts/Alerts";
import LayoutDefault from "@components/Layouts/default";
import { PostType } from "@components/postType";
import { DateColumnFilter, NoFilter } from "@components/Table";
import EditButton from "@components/Utils/Buttons/EditButton";
import RemoveButton from "@components/Utils/Buttons/RemoveButton";
import StatusButton from "@components/Utils/Buttons/StatusButton";
import SelectCity from "@components/Utils/SelectCity";
import SelectState from "@components/Utils/SelectState";
import { useGlobal } from "@context/global";
import axios, { AxiosResponse } from "axios";
import { ColumnFn } from "models/ColumnFn";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import Select from "react-select";
import useSWR from "swr";

interface CustomComponent {
  post: any;
  setPost: Function;
}

const fetcherUsers = (url = "", token = "") =>
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data.users);

const fetcherRegions = (url = "", token = "") =>
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data.regions);

const fetcherResales = (url = "", token = "") =>
  axios
    .get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data.resales);

interface User {
  activatedAt?: string;
  active?: boolean;
  cityId?: number;
  createdAt?: string;
  email?: string;
  id?: number;
  identification?: string;
  name?: string;
  phone?: string;
  roleId?: number;
  stateId: number;
  status?: string;
  updatedAt?: string;
}

interface Consultor {
  formRegion?: string;
  formResale?: string;
  id?: number;
  resale?: string;
  resaleId?: number;
  regionId?: number;
  user: User;
  userId?: number;
}

export default function Consultores() {
  const { token = "" } = useGlobal();
  const url = `${process.env.API_URL}/consultant`;

  const [estado, setEstado] = useState<number | null>(null);

  const fields = [
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          <label className="form-label">Aprovar Consultor</label>

          {post.hasOwnProperty("user") && (
            <Form.Check
              type="switch"
              id="custom-switch"
              checked={post.user.status === "approved"}
              onChange={(event) => {
                var user_status = "";

                if(!post.resaleId && !post.regionId) {
                  AlertError("Por favor, selecione uma Revenda e uma Região", 2000);
                  return
                }

                if(!post.resaleId) {
                  AlertError("Por favor, selecione uma Revenda", 2000);
                  return
                }

                if(!post.regionId) {
                  AlertError("Por favor, selecione uma Região", 2000);
                  return
                }

                if (event.target.checked) {
                  user_status = "approved";
                } else {
                  user_status = "";
                }

                setPost({
                  ...post,
                  user: {
                    ...post.user,
                    status: user_status,
                  },
                });
              }}
            />
          )}
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          <label className="form-label" htmlFor="name">
            Nome
          </label>

          {post.hasOwnProperty("user") && (
            <input
              value={post?.user.name}
              onChange={(e) =>
                setPost({
                  ...post,
                  user: {
                    ...post.user,
                    name: e.target.value,
                  },
                })
              }
              type="text"
              id="name"
              className="form-control"
            />
          )}
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          <label className="form-label" htmlFor="email">
            E-mail
          </label>

          {post.hasOwnProperty("user") && (
            <input
              value={post.user.email}
              onChange={(e) =>
                setPost({
                  ...post,
                  user: {
                    ...post.user,
                    email: e.target.value,
                  },
                })
              }
              type="email"
              id="email"
              className="form-control"
            />
          )}
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          <label className="form-label" htmlFor="phone">
            Telefone
          </label>

          {post.hasOwnProperty("user") && (
            <input
              value={post.user.phone}
              onChange={(e) =>
                setPost({
                  ...post,
                  user: {
                    ...post.user,
                    phone: e.target.value,
                  },
                })
              }
              type="text"
              id="phone"
              className="form-control"
            />
          )}
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          <label className="form-label" htmlFor="identification">
            CPF
          </label>

          {post.hasOwnProperty("user") && (
            <input
              value={post.user.identification}
              onChange={(e) =>
                setPost({
                  ...post,
                  user: {
                    ...post.user,
                    identification: e.target.value,
                  },
                })
              }
              type="text"
              id="identification"
              className="form-control"
            />
          )}
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          <label className="form-label" htmlFor="formResale">
            Revenda Informada pelo Usuário
          </label>

          <input
            value={post.formResale}
            onChange={(e) =>
              setPost({
                ...post,
                formResale: e.target.value,
              })
            }
            type="text"
            id="formResale"
            className="form-control"
          />
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          <label className="form-label" htmlFor="formRegion">
            Região Informada pelo Usuário
          </label>

          <input
            value={post.formRegion}
            onChange={(e) =>
              setPost({
                ...post,
                formRegion: e.target.value,
              })
            }
            type="text"
            id="formRegion"
            className="form-control"
          />
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          {post.hasOwnProperty("user") && (
            <SelectState
              value={post.user.stateId}
              onChange={(newValue: any) => {
                setEstado(newValue.value);
                setPost({
                  ...post,
                  user: {
                    ...post.user,
                    stateId: newValue.value,
                  },
                });
              }}
            />
          )}
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div className="mb-3">
          {post.hasOwnProperty("user") && (
            <SelectCity
              value={post.user.cityId}
              state={post.user.stateId ?? estado}
              onChange={(newValue: any) => {
                setPost({
                  ...post,
                  user: {
                    ...post.user,
                    cityId: newValue.value,
                  },
                });
              }}
            />
          )}
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div>
          <label className="form-label">Revenda selecionada pelo ADM</label>

          <Select
            value={resales_as_options.find(
              (resale: any) => resale.value === post.resaleId
            )}
            placeholder="Selecione a revenda..."
            classNamePrefix="select"
            className="mb-4"
            options={resales_as_options}
            onChange={(newValue: any) => {
              setPost({
                ...post,
                resaleId: newValue.value,
              });
            }}
          />
        </div>
      ),
    },
    {
      Component: ({ post, setPost }: CustomComponent) => (
        <div>
          <label className="form-label">Região selecionada pelo ADM</label>

          <Select
            value={regions_as_options.find(
              (region: any) => region.value === post.regionId
            )}
            placeholder="Selecione a região..."
            classNamePrefix="select"
            className="mb-4"
            options={regions_as_options}
            onChange={(newValue: any) => {
              setPost({
                ...post,
                regionId: newValue.value,
              });
            }}
          />
        </div>
      ),
    },
  ];

  const updateFn = async (
    updateUrl = "",
    url = "",
    options = {},
    post: Consultor,
    fetcherDataFn = (result: any) => {}
  ) => {
    try {
      const updateConsultantUser = axios.patch(
        `${process.env.API_URL}/user/${post.user.id}`,
        {
          name: post.user.name,
          identification: post.user.identification,
          email: post.user.email,
          phone: post.user.phone,
          stateId: post.user.stateId,
          cityId: post.user.cityId,
          status: post.user.status,
        },
        options
      );

      const updateConsultant = axios.patch(
        `${process.env.API_URL}/consultant/${post.id}`,
        {
          formResale: post.formResale,
          formRegion: post.formRegion,
          resaleId: post.resaleId,
          regionId: post.regionId,
        },
        options
      );

      const result = axios.get(url, options);

      let [resultUpdateConsultantUser, resultUpdateConsultant, resultGet] =
        await Promise.all([updateConsultantUser, updateConsultant, result]);

      if (
        resultGet.data.success &&
        resultUpdateConsultantUser.data.success &&
        resultUpdateConsultant.data.success
      ) {
        AlertItemEdited();
      } else {
        AlertError();
      }

      return fetcherDataFn(resultGet);
    } catch (error) {
      AlertError();
    }
  };

  const { data: users, error } = useSWR(
    [`${process.env.API_URL}/user`, token],
    fetcherUsers
  );

  const users_as_options = users?.map((user: { id: any; name: any }) => ({
    value: user.id,
    label: user.name,
  }));

  const { data: regions } = useSWR(
    [`${process.env.API_URL}/region`, token],
    fetcherRegions
  );

  const regions_as_options = regions?.map(
    (user: { id: any; name: string }) => ({
      value: user.id,
      label: user.name,
    })
  );

  const { data: resale } = useSWR(
    [`${process.env.API_URL}/resale`, token],
    fetcherResales
  );

  const resales_as_options = resale?.map((user: { id: any; name: string }) => ({
    value: user.id,
    label: user.name,
  }));

  const colunas =
    ({ onUpdate, onRemove, getPost, onStatusChange, reloadData }: ColumnFn) =>
    () =>
      [
        {
          Header: "Name",
          accessor: "user.name",
        },
        {
          Header: "Telefone",
          accessor: "user.phone",
        },
        {
          Header: "CPF",
          accessor: "user.identification",
        },
        {
          Header: "Aprovado",
          accessor: "user.status",
          Cell: ({ value = "" }) => (
            <span>{value === "approved" ? "✓" : "✖"}</span>
          ),
        },
        {
          Header: "Criado Em",
          accessor: "user.createdAt",
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
                <EditButton
                  className="me-2"
                  onClick={() => {
                    onUpdate(value);
                  }}
                />

                {currentPost && (
                  <StatusButton
                    active={currentPost.user["active"]}
                    onClick={async () => {
                      const options = {
                        headers: {
                          Authorization: `Bearer ${token}`,
                        },
                      };

                      await axios.patch(
                        `${process.env.API_URL}/user/${currentPost.user.id}`,
                        {
                          active: !currentPost.user["active"],
                        },
                        options
                      );

                      const result = await axios.get(url, options);

                      if (result.status === 200) {
                        AlertItemEdited();
                        reloadData();
                      } else {
                        AlertError();
                      }
                    }}
                  />
                )}
              </div>
            );
          },
        },
      ];

  return (
    <LayoutDefault>
      <PostType
        removeAddButton
        dataConfig={{
          url,
          token,
          fetcherFn: (
            fetcherDataFn = () => {},
            url = "/consultant?includes=region,resale",
            options = {}
          ) => axios.get(url, options).then(fetcherDataFn),
          fetcherDataFn: (response: AxiosResponse) => {
            return response.data.consultants;
          },
          updateUrlFn: (url = "", id = "") =>
            `${process.env.API_URL}/user/${id}`,
          updateFn: updateFn,
        }}
        tableConfig={{
          columnsFn: colunas,
        }}
        formConfig={{
          insertTitle: "Adicionar Consultor",
          editTitle: "Editar Consultor",
          fields,
        }}
        pageConfig={{
          pageTitle: "Consultores",
        }}
      />
    </LayoutDefault>
  );
}
