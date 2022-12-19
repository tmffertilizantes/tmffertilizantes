import { PostType } from '@components';
import { NextPage } from 'next';
import { useGlobal } from '@context/global';
import { AxiosResponse } from 'axios';

interface CustomComponent {
  post: any;
  setPost: Function;
}

const fields = [{
  field: "name",
  label: "Nome",
  placeholder: "Digite o nome da categoria",
  customEvents: (setCategoria: ( arg0: ( categoria: any ) => any ) => any) => ({
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setCategoria((categoria) => ({
      ...categoria,
      name: e.target.value,
      slug: e.target.value.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '')
    }))
  })
}, {
  field: "lorem",
  label: "Lorem",
  placeholder: "Digite Lorem"
}, {
  Component: ({ post, setPost }: CustomComponent) => (
    <textarea
      value={post.ipsum}
      onChange={(e) => setPost({ ...post, ipsum: e.target.value })}
    />
  )
}]

const Page: NextPage = () => {
  const { token = '' } = useGlobal();
  const url = 'http://api.tmf.pullup.tech/api/v1/category';

  return (
    <PostType
      dataConfig={{
        url,
        token,
        fetcherDataFn: (response: AxiosResponse) => response.data.categorys,
      }}
      formConfig={{
        insertTitle: "Adicionar Categoria",
        editTitle: "Editar Categoria",
        fields
      }}
    />
  )
}

export default Page
