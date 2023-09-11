/* eslint-disable max-params */
type ArgsType = {
  corporateDocument: string
  page: number
}

export const queries = {
  getUserData: async (_: unknown, args: ArgsType, ctx: Context) => {
    const {
      clients: { masterdata },
    } = ctx

    const { corporateDocument, page } = args

    return masterdata
      .searchDocuments({
        dataEntity: 'CL',
        fields: ['email'],
        where: `corporateDocument=${corporateDocument}`,
        pagination: {
          page,
          pageSize: 15,
        },
      })
      .then((data) => {
        const maskedData = data.map((item: any) => ({
          email: maskEmail(item.email),
        }))

        return maskedData
      })
  },
}
function maskEmail(email: string): string {
  const [nomeUsuario, dominio] = email.split('@')

  // Mantém os primeiros 2 caracteres do nome de usuário, seguidos por asteriscos
  const nomeUsuarioMascarado =
    nomeUsuario.slice(0, 2) + '*'.repeat(nomeUsuario.length - 2)

  // Mantém os primeiros 2 caracteres do domínio, seguidos por asteriscos
  const dominioMascarado = dominio.slice(0, 2) + '*'.repeat(dominio.length - 2)

  return `${nomeUsuarioMascarado}@${dominioMascarado}`
}
