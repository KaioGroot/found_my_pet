export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-[#7A00E6] to-[#5C1BD9] text-white w-full ">
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between">
          <div className="flex flex-col md:w-1/3">
            <img className="w-32" src="/images/logo-white.svg" alt="Logo" />
            <p className="text-xs mt-4">
              Desenvolvido com amor por <a className="underline" href="https://github.com/luanfonceca">Kaio Ferreira</a>
            </p>
          </div>
          <div className="flex flex-col md:w-2/3 mt-4 md:mt-0">
            <h3 className="text-xl font-bold">Contato</h3>
            <p className="text-xs mt-2">
              <a className="underline" href="mailto:contato@primeiroprojeto.com.br">contato@primeiroprojeto.com.br</a>
            </p>
            <p className="text-xs mt-2">
              <a className="underline" href="https://api.whatsapp.com/send?phone=5511951234567">+55 11 95123-4567</a>
            </p>
            <p className="text-xs mt-2">
              <a className="underline" href="https://www.instagram.com/kaiowdev/">@kaiowdev</a>
            </p>
          </div>
        </div>
      </div>
    </footer>

  )
}
