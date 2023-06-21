import { PostType } from "@components";
import { NextPage } from "next";
import { useGlobal } from "@context/global";
import { AxiosResponse } from "axios";
import LayoutDefault from "@components/Layouts/default";
import SelectLanguage from "@components/Utils/SelectLanguage";
import { useMemo, useState } from "react";

interface CustomComponent {
  post: any;
  setPost: Function;
}

const Page: NextPage = () => {
  const { token = "" } = useGlobal();
  const url = `${process.env.API_URL}/culture`;

  const [language, setLanguage] = useState("pt-BR");

  const fields = [
    {
      field: "name",
      label: "Nome",
      placeholder: "Exemplo",
      customEvents: (setCultura: (arg0: (cultura: any) => any) => any) => ({
        onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
          setCultura((cultura) => ({
            ...cultura,
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
        <SelectLanguage
          className="mb-4"
          value={post.lang ? post.lang : language}
          onChange={(event) => {
            setLanguage(event.target.value);
            setPost({ ...post, lang: event.target.value });
          }}
        />
      ),
    },
  ];

  const initialData = useMemo(() => {
    let data = null;

    data = {
      active: true,
    };

    if (language) {
      data = {
        ...data,
        lang: language,
      };
    }

    if (language) {
      data = {
        lang: language,
      };
    }

    return data;
  }, [language]);

  return (
    <LayoutDefault>
      <PostType
        initialPostData={initialData}
        dataConfig={{
          url,
          token,
          fetcherDataFn: (response: AxiosResponse) => response.data.cultures,
        }}
        formConfig={{
          insertTitle: "Adicionar Cultura",
          editTitle: "Editar Cultura",
          fields,
        }}
        pageConfig={{
          pageTitle: "Culturas",
        }}
      />
    </LayoutDefault>
  );
};

export default Page;
