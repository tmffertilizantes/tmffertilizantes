import Logo from "@components/Logo";
import Link from "next/link";
import NavLinkCollapse from "@components/Navbar/NavLinkCollapse";
import { logout } from "@context/user";

export default function NavBar() {
  return (
    <nav className="navbar-vertical navbar">
      <div className="nav-scroller">
        <Link href="/">
          <a className="navbar-brand">
            <Logo theme="white" />
          </a>
        </Link>

        <ul className="navbar-nav flex-column" id="sideNavbar">
          <li className="nav-item">
            <Link href="/analises">
              <a className="nav-link">
                <i className="nav-icon fe fe-pie-chart me-2"></i>Análises
              </a>
            </Link>
          </li>

          <li className="nav-item">
            <NavLinkCollapse
              title={"Usuários"}
              id={"usuarios"}
              icon={<i className="nav-icon fe fe-user me-2"></i>}
            >
              <ul className="nav flex-column mb-2">
                <li className="nav-item">
                  <Link href="/administradores">
                    <a className="nav-link">Administradores</a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/consultores">
                    <a className="nav-link">Consultores</a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/produtores">
                    <a className="nav-link">Produtores</a>
                  </Link>
                </li>
              </ul>
            </NavLinkCollapse>
          </li>

          <li className="nav-item">
            <NavLinkCollapse
              title={"Produtos"}
              id={"produtos"}
              icon={<i className="nav-icon fe fe-book me-2"></i>}
            >
              <ul className="nav flex-column mb-2">
                <li className="nav-item">
                  <Link href="/produtos">
                    <a className="nav-link">Produtos</a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/categorias">
                    <a className="nav-link">Categorias</a>
                  </Link>
                </li>
              </ul>
            </NavLinkCollapse>
          </li>

          <li className="nav-item">
            <Link href="/culturas">
              <a className="nav-link">
                <i className="nav-icon fe fe-feather me-2"></i>Culturas
              </a>
            </Link>
          </li>

          {/* <li className="nav-item">
            <Link href="/nutrientes">
              <a className="nav-link">
                <i className="nav-icon fe fe-book me-2"></i>Nutrientes
              </a>
            </Link>
          </li> */}

          <li className="nav-item">
            <Link href="/regioes">
              <a className="nav-link">
                <i className="nav-icon fe fe-map me-2"></i>Regiões
              </a>
            </Link>
          </li>

          <li className="nav-item">
            <Link href="/revendas">
              <a className="nav-link">
                <i className="nav-icon fe fe-shopping-cart me-2"></i>Revendas
              </a>
            </Link>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/custo-de-producao">
              <i className="nav-icon fe fe-dollar-sign me-2"></i>Custo de
              produção
            </a>
          </li>

          <li className="nav-item">
            <a className="nav-link" href="/custo-tmf-calcario">
              <i className="nav-icon fe fe-dollar-sign me-2"></i>Custo TMF x
              Calcário
            </a>
          </li>

          <li className="nav-item">
            <NavLinkCollapse
              title={"Configurações"}
              id={"configuracoes"}
              icon={<i className="nav-icon fe fe-settings me-2"></i>}
            >
              <ul className="nav flex-column mb-2">
                <li className="nav-item">
                  <Link href="/termos">
                    <a className="nav-link">Termos</a>
                  </Link>
                </li>

                <li className="nav-item">
                  <Link href="/contato">
                    <a className="nav-link">Contato</a>
                  </Link>
                </li>
              </ul>
            </NavLinkCollapse>
          </li>

          <li className="nav-item">
            <div className="nav-divider"></div>
          </li>

          <li className="nav-item mb-4">
            <Link href="/login">
              <a className="nav-link" onClick={logout}>
                <i className="nav-icon fe fe-log-out me-2"></i>Sair
              </a>
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
