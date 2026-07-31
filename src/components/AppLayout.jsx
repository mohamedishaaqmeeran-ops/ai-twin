import {
  useEffect,
  useMemo,
  useState,
} from "react";

import {
  Outlet,
  NavLink,
  useNavigate,
  useLocation,
  Link,
} from "react-router-dom";

import {
  useDispatch,
  useSelector,
} from "react-redux";

import {
  toast,
} from "react-toastify";

import {
  Home,
  UserRound,
  Sparkles,
  Database,
  Package,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Share2,
  Menu,
  X,
  Wifi,
  Radio,
  Bell,
  Video,
  BadgeCheck,
  Crown,
  Store,
  Coins,
  Bot,
  Heart,
  History,
  ShoppingBag,
  Users,
  ShieldCheck,
  Activity,
} from "lucide-react";

import {
  logoutUser,
} from "../features/auth/authSlice";

const API =
  String(
    import.meta.env.VITE_API_URL ||
      "https://twinn-backend.onrender.com/api"
  )
    .trim()
    .replace(/\/+$/, "");

/* =========================================================
   HELPERS
========================================================= */

const normalizeRole = (role) => {
  const value = String(role || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

  const roles = {
    admin: "admin",
    manager: "manager",

    brandcreator: "brandcreator",
    brand_creator: "brandcreator",
    brandcreatoruser: "brandcreator",

    contentcreator: "contentcreator",
    content_creator: "contentcreator",

    user: "user",
  };

  return roles[value] || "user";
};

const normalizePlan = (plan) =>
  String(plan || "")
    .trim()
    .toLowerCase()
    .replace(/[\s_-]/g, "");

const ROLE_HOME = {
  admin: "/admin",
  manager: "/app/dashboard",
  brandcreator: "/app/dashboard",
  contentcreator: "/app/dashboard",
  user: "/user/home",
};

const ROLE_LABELS = {
  admin: "Admin",
  manager: "Manager",
  brandcreator: "Brand Creator",
  contentcreator: "Content Creator",
  user: "User",
};

/* =========================================================
   APP LAYOUT
========================================================= */

export default function AppLayout() {
  const navigate =
    useNavigate();

  const location =
    useLocation();

  const dispatch =
    useDispatch();

  const [mobileMenu, setMobileMenu] =
    useState(false);

  const [twin, setTwin] =
    useState(null);

  const [loadingTwin, setLoadingTwin] =
    useState(false);

  const {
    user,
    authChecked,
  } = useSelector(
    (state) => state.auth || {}
  );

  const role =
    normalizeRole(
      user?.role
    );

  const plan =
    normalizePlan(
      user?.plan
    );

  const roleLabel =
    ROLE_LABELS[role] ||
    "User";

  const isAdmin =
    role === "admin";

  const isManager =
    role === "manager";

  const isBrandCreator =
    role === "brandcreator";

  const isContentCreator =
    role === "contentcreator";

  const isNormalUser =
    role === "user";

  const isInternalRole =
    isAdmin ||
    isManager;

  const isCreatorDashboardRole =
    isBrandCreator ||
    isContentCreator ||
    isManager ||
    isAdmin;

  const isPro =
    isInternalRole ||
    plan === "pro" ||
    plan === "business" ||
    plan === "agency";

  const dashboardPath =
    ROLE_HOME[role] ||
    "/user/home";

  const hasTwin =
    Boolean(twin);

  const twinName =
    twin?.name ||
    "My AI Twin";

  const twinImage =
    twin?.image ||
    twin?.avatarImage ||
    twin?.appearance?.avatarUrl ||
    "/images/bbb.png";

  const canCreateTwin =
    isBrandCreator ||
    isManager ||
    isAdmin;

  const canEditTwin =
    isBrandCreator ||
    isManager ||
    isAdmin;

  const canTrainTwin =
    isBrandCreator ||
    isManager ||
    isAdmin;

  const canManageProducts =
    isBrandCreator ||
    isManager ||
    isAdmin;

  const canConnectSocial =
    isBrandCreator ||
    isManager ||
    isAdmin;

  const canScheduleLive =
    isBrandCreator ||
    isManager ||
    isAdmin;

  const canGoLive =
    isBrandCreator ||
    isManager ||
    isAdmin;

  const canViewAnalytics =
    isCreatorDashboardRole;

  const sidebarSections =
    useMemo(() => {
      if (isNormalUser) {
        return [
          {
            title: "General",
            items: [
              {
                label: "Home",
                icon: Home,
                to: "/user/home",
              },
              {
                label: "Live Shop",
                icon: Radio,
                to: "/live-shop",
              },
              {
                label: "Browse Products",
                icon: ShoppingBag,
                to: "/live-shop",
              },
              {
                label: "AI Twin Chat",
                icon: Bot,
                to: "/live-shop",
              },
            ],
          },
          {
            title: "My Account",
            items: [
              {
                label: "Wishlist",
                icon: Heart,
                to: "/user/wishlist",
              },
              {
                label: "Orders",
                icon: History,
                to: "/user/orders",
              },
              {
                label: "Profile",
                icon: UserRound,
                to: "/user/profile",
              },
              {
                label: "Settings",
                icon: Settings,
                to: "/user/profile",
              },
            ],
          },
        ];
      }

      if (isContentCreator) {
        return [
          {
            title: "General",
            items: [
              {
                label: "Dashboard",
                icon: Home,
                to: "/app",
              },
              {
                label: "AI Twins",
                icon: UserRound,
                to: "/app/twin",
              },
              {
                label: "Avatar Marketplace",
                icon: Store,
                to: "/app/avatar-marketplace",
              },
            ],
          },
          {
            title: "Content",
            items: [
              {
    label: "Products",
    icon: Package,
    to: "/app/products",
    hidden: !canManageProducts,
},
              {
                label: "Live Schedule",
                icon: Calendar,
                to: "/app/schedule",
              },
              {
                label: "Analytics",
                icon: BarChart3,
                to: "/app/analytics",
              },
            ],
          },
          {
            title: "System",
            items: [
              {
                label: "Settings",
                icon: Settings,
                to: "/app/settings",
              },
            ],
          },
        ];
      }

      const creatorItems = [
        {
          title: "General",
          items: [
            {
              label: "Dashboard",
              icon: Home,
              to: dashboardPath,
              end: true,
            },
            {
              label: "My AI Twin",
              icon: UserRound,
              to: "/app/twin",
            },
            {
              label: "Avatar Marketplace",
              icon: Store,
              to: "/app/avatar-marketplace",
            },
          ],
        },
        {
          title: "AI Management",
          items: [
            {
              label:
                hasTwin
                  ? "Edit AI Twin"
                  : "Create AI Twin",
              icon: Sparkles,
              to:
                hasTwin
                  ? "/app/twin/edit"
                  : "/app/twin/create",
              hidden:
                !canCreateTwin &&
                !canEditTwin,
            },
            {
              label:
                isPro
                  ? "Advanced Training"
                  : "Train Twin",
              icon: Database,
              to: "/app/twin/train",
              hidden:
                !canTrainTwin,
            },
            {
              label: "Generate AI Video",
              icon: Video,
              to: "/app/twin/generate-video",
              hidden:
                !canEditTwin,
            },
            {
              label: "Test Twin",
              icon: BadgeCheck,
              to: "/app/twin/test",
            },
          ],
        },
        {
          title: "Selling",
          items: [
            {
    label: "Products",
    icon: Package,
    to: "/app/products",
    hidden: !canManageProducts,
},
            {
              label: "Connect Social",
              icon: Wifi,
              to: "/app/connect",
              hidden:
                !canConnectSocial,
            },
            {
              label: "Schedule Live",
              icon: Calendar,
              to: "/app/schedule",
              requiresTwin: true,
              hidden:
                !canScheduleLive,
            },
            {
              label:
                isPro
                  ? "Pro Live"
                  : "Go Live",
              icon: Radio,
              to: "/app/golive",
              requiresTwin: true,
              hidden:
                !canGoLive,
            },
          ],
        },
        {
          title: "System",
          items: [
            {
              label:
                isPro
                  ? "Pro Analytics"
                  : "Analytics",
              icon: BarChart3,
              to: "/app/analytics",
              hidden:
                !canViewAnalytics,
            },
            {
              label: "Settings",
              icon: Settings,
              to: "/app/settings",
            },
          ],
        },
      ];

      if (isManager || isAdmin) {
        creatorItems.splice(
          1,
          0,
          {
            title: "Operations",
            items: [
              {
                label: "Team Management",
                icon: Users,
                to:
                  isAdmin
                    ? "/admin/users"
                    : "/app/settings",
              },
              {
                label: "Platform Activity",
                icon: Activity,
                to: "/app/analytics",
              },
            ],
          }
        );
      }

      return creatorItems;
    }, [
      isNormalUser,
      isContentCreator,
      isManager,
      isAdmin,
      dashboardPath,
      hasTwin,
      canCreateTwin,
      canEditTwin,
      canTrainTwin,
      canConnectSocial,
      canScheduleLive,
      canGoLive,
      canViewAnalytics,
      isPro,
    ]);

  

  useEffect(() => {
    if (
      !authChecked ||
      !user ||
      !isCreatorDashboardRole
    ) {
      setTwin(null);
      setLoadingTwin(false);
      return;
    }

    let cancelled = false;

    const loadTwin = async () => {
      try {
        setLoadingTwin(true);

        const accessToken =
          localStorage.getItem(
            "twinn_access_token"
          );

        const response =
          await fetch(
            `${API}/twin`,
            {
              method: "GET",
              credentials: "include",
              headers: {
                Accept: "application/json",
                ...(accessToken
                  ? {
                      Authorization:
                        `Bearer ${accessToken}`,
                    }
                  : {}),
              },
            }
          );

        const data =
          await response
            .json()
            .catch(() => ({}));

        if (cancelled) {
          return;
        }

        if (!response.ok) {
          console.error(
            "LOAD TWIN ERROR:",
            {
              status: response.status,
              code: data?.code,
              message: data?.message,
            }
          );

          setTwin(null);
          return;
        }

        const twins =
          Array.isArray(data)
            ? data
            : Array.isArray(data?.twins)
              ? data.twins
              : Array.isArray(data?.data)
                ? data.data
                : data?.twin
                  ? [data.twin]
                  : [];

        setTwin(twins[0] || null);
      } catch (error) {
        if (!cancelled) {
          console.error(
            "LOAD TWIN REQUEST ERROR:",
            error
          );

          setTwin(null);
        }
      } finally {
        if (!cancelled) {
          setLoadingTwin(false);
        }
      }
    };

    loadTwin();

    return () => {
      cancelled = true;
    };
  }, [
    authChecked,
    user?._id,
    user?.id,
    isCreatorDashboardRole,
  ]);

  const closeMobileMenu =
    () => {
      setMobileMenu(
        false
      );
    };

  const handleProtectedNav =
    (path) => {
      if (
        !isCreatorDashboardRole
      ) {
        navigate(
          dashboardPath
        );

        closeMobileMenu();
        return;
      }

      if (!hasTwin) {
        toast.warning(
          "Please create your AI Twin first to access this section.",
          {
            toastId:
              "create-twin-warning",
          }
        );

        navigate(
          "/app/twin/create"
        );

        closeMobileMenu();
        return;
      }

      navigate(path);
      closeMobileMenu();
    };

  const handleMenuItem =
    (item) => {
      if (
        item.requiresTwin
      ) {
        handleProtectedNav(
          item.to
        );

        return;
      }

      navigate(
        item.to
      );

      closeMobileMenu();
    };

  const handleLogout =
    async () => {
      try {
        await dispatch(
          logoutUser()
        ).unwrap?.();
      } catch {
        // Clear the UI even if the server session
        // is already expired.
      } finally {
        closeMobileMenu();

        navigate(
          "/",
          {
            replace: true,
          }
        );
      }
    };

  const linkClass =
    ({ isActive }) =>
      `flex items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
        isActive
          ? "brand-gradient text-white shadow-lg shadow-pink-500/20"
          : "text-white/70 hover:translate-x-1 hover:bg-white/10 hover:text-white"
      }`;

  const mobileClass =
    ({ isActive }) =>
      `flex flex-col items-center justify-center gap-1 text-[11px] font-bold transition ${
        isActive
          ? "text-[var(--brand-pink)]"
          : "text-muted-foreground"
      }`;

  const headerTitle =
    isNormalUser
      ? "Customer Dashboard"
      : isContentCreator
        ? "Content Creator Dashboard"
        : isManager
          ? "Manager Dashboard"
          : isAdmin
            ? "Admin Operations"
            : `${isPro ? "Pro " : ""}AI Twin Dashboard`;

  if (!authChecked) {
    return (
      <div className="grid min-h-dvh place-items-center bg-background text-foreground">
        <p className="text-sm font-bold text-[var(--brand-pink)]">
          Checking login...
        </p>
      </div>
    );
  }

  const headerSubtitle =
    isNormalUser
      ? "Explore live products, AI Twins, orders and saved items."
      : isContentCreator
        ? "Review assigned Twins, products, schedules and analytics."
        : isManager ||
            isAdmin
          ? "Manage platform operations, content and live commerce."
          : isPro
            ? "Advanced tools, multi-platform live and Pro analytics."
            : "Create, train, sell and go live.";

  return (
    <div className="flex min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* =====================================================
          DESKTOP SIDEBAR
      ====================================================== */}

      <aside className="fixed left-0 top-0 z-40 hidden h-screen w-80 flex-col overflow-y-auto bg-gradient-to-b from-[#040816] via-[#090f24] to-[#0d1028] p-5 text-white lg:flex">
        <LogoBlock />

        <RoleBadge
          role={role}
          roleLabel={roleLabel}
          isPro={isPro}
          plan={plan}
        />

        {isCreatorDashboardRole && (
          <TwinCard
            loading={loadingTwin}
            hasTwin={hasTwin}
            twinName={twinName}
            twinImage={twinImage}
            isPro={isPro}
            canCreateTwin={canCreateTwin}
            onCreate={() =>
              navigate(
                "/app/twin/create"
              )
            }
          />
        )}

        {isNormalUser && (
          <UserCard
            user={user}
          />
        )}

        <nav className="mt-6 flex-1 space-y-1">
          {sidebarSections.map(
            (section) => (
              <div
                key={
                  section.title
                }
              >
                <MenuTitle
                  title={
                    section.title
                  }
                />

                {section.items
                  .filter(
                    (item) =>
                      !item.hidden
                  )
                  .map(
                    (item) => {
                      const Icon =
                        item.icon;

                      if (
                        item.requiresTwin
                      ) {
                        return (
                          <SidebarButton
                            key={
                              item.label
                            }
                            icon={
                              Icon
                            }
                            text={
                              item.label
                            }
                            active={
                              location.pathname.startsWith(
                                item.to
                              )
                            }
                            onClick={() =>
                              handleMenuItem(
                                item
                              )
                            }
                          />
                        );
                      }

                      return (
                        <NavLink
                          key={
                            item.label
                          }
                          to={
                            item.to
                          }
                          end={
                            item.end
                          }
                          className={
                            linkClass
                          }
                        >
                          <Icon
                            size={
                              18
                            }
                          />
                          {
                            item.label
                          }
                        </NavLink>
                      );
                    }
                  )}
              </div>
            )
          )}
        </nav>

        <div className="mt-6 border-t border-white/10 pt-5">
          <button
            onClick={
              handleLogout
            }
            className="brand-gradient flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold text-white"
          >
            <LogOut
              size={18}
            />
            Logout
          </button>
        </div>
      </aside>

      {/* =====================================================
          MOBILE HEADER
      ====================================================== */}

      <header className="fixed left-0 right-0 top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-card px-4 lg:hidden">
        <LogoBlock
          compact
          subtitle={
            isNormalUser
              ? "Live Shopping"
              : isPro
                ? "Pro Live Commerce"
                : "AI Live Commerce"
          }
        />

        <button
          onClick={() =>
            setMobileMenu(
              true
            )
          }
          className="grid h-10 w-10 place-items-center rounded-xl border border-border"
          aria-label="Open navigation"
        >
          <Menu className="h-5 w-5" />
        </button>
      </header>

      {/* =====================================================
          MOBILE DRAWER
      ====================================================== */}

      {mobileMenu && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <button
            className="absolute inset-0 bg-black/60"
            onClick={
              closeMobileMenu
            }
            aria-label="Close navigation overlay"
          />

          <aside className="relative h-full w-80 max-w-[85%] overflow-y-auto bg-gradient-to-b from-[#040816] via-[#090f24] to-[#0d1028] p-5 text-white">
            <div className="flex items-center justify-between">
              <LogoBlock
                mobile
                subtitle={
                  isNormalUser
                    ? "Live Shopping"
                    : isPro
                      ? "Pro AI Live Commerce"
                      : "AI Live Commerce"
                }
                onClick={
                  closeMobileMenu
                }
              />

              <button
                onClick={
                  closeMobileMenu
                }
                className="grid h-10 w-10 place-items-center rounded-xl bg-white/10"
                aria-label="Close navigation"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <RoleBadge
              role={role}
              roleLabel={
                roleLabel
              }
              isPro={isPro}
              plan={plan}
            />

            <div className="mt-3 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black">
              <Coins className="h-4 w-4 text-yellow-300" />
              {Number(
                user?.credits ||
                  0
              ).toLocaleString(
                "en-US"
              )}{" "}
              Credits
            </div>

            {isCreatorDashboardRole ? (
              <TwinCard
                loading={
                  loadingTwin
                }
                hasTwin={
                  hasTwin
                }
                twinName={
                  twinName
                }
                twinImage={
                  twinImage
                }
                isPro={
                  isPro
                }
                compact
                canCreateTwin={
                  canCreateTwin
                }
                onCreate={() =>
                  handleMenuItem(
                    {
                      to: "/app/twin/create",
                    }
                  )
                }
              />
            ) : (
              <UserCard
                user={user}
                compact
              />
            )}

            <nav className="mt-6 space-y-2">
              {sidebarSections.map(
                (section) => (
                  <div
                    key={
                      section.title
                    }
                  >
                    <MenuTitle
                      title={
                        section.title
                      }
                    />

                    {section.items
                      .filter(
                        (item) =>
                          !item.hidden
                      )
                      .map(
                        (item) => {
                          const Icon =
                            item.icon;

                          if (
                            item.requiresTwin
                          ) {
                            return (
                              <SidebarButton
                                key={
                                  item.label
                                }
                                icon={
                                  Icon
                                }
                                text={
                                  item.label
                                }
                                active={
                                  location.pathname.startsWith(
                                    item.to
                                  )
                                }
                                onClick={() =>
                                  handleMenuItem(
                                    item
                                  )
                                }
                              />
                            );
                          }

                          return (
                            <NavLink
                              key={
                                item.label
                              }
                              to={
                                item.to
                              }
                              end={
                                item.end
                              }
                              onClick={
                                closeMobileMenu
                              }
                              className={
                                linkClass
                              }
                            >
                              <Icon
                                size={
                                  18
                                }
                              />
                              {
                                item.label
                              }
                            </NavLink>
                          );
                        }
                      )}
                  </div>
                )
              )}
            </nav>

            <div className="mt-8 border-t border-white/10 pt-5">
              <button
                onClick={
                  handleLogout
                }
                className="brand-gradient flex w-full items-center justify-center gap-3 rounded-2xl py-4 text-sm font-bold text-white"
              >
                <LogOut
                  size={18}
                />
                Logout
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main className="min-h-screen flex-1 pb-24 pt-16 lg:ml-80 lg:pb-0 lg:pt-0">
        <header className="sticky top-0 z-30 hidden h-24 items-center justify-between border-b border-border bg-card/90 px-8 backdrop-blur lg:flex">
          <div>
            <p className="text-sm font-bold text-[var(--brand-pink)]">
              Welcome back ·{" "}
              {roleLabel}
            </p>

            <h2 className="text-3xl font-black">
              {headerTitle}
            </h2>

            <p className="text-sm text-muted-foreground">
              {headerSubtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button className="grid h-11 w-11 place-items-center rounded-2xl border border-border bg-card">
              <Bell className="h-5 w-5 text-[var(--brand-pink)]" />
            </button>

            {isBrandCreator && (
              <button
                onClick={() => {
                  if (!isPro) {
                    navigate(
                      "/pricing"
                    );
                  }
                }}
                className="brand-gradient rounded-[5px] px-6 py-3 text-sm font-bold text-white shadow-md hover:opacity-90"
              >
                {isPro
                  ? "Pro Active"
                  : "Upgrade"}
              </button>
            )}

            {(isManager ||
              isAdmin) && (
              <div className="flex items-center gap-2 rounded-[5px] border border-border bg-background px-4 py-3 text-sm font-bold">
                <ShieldCheck className="h-4 w-4 text-[var(--brand-pink)]" />
                Internal Access
              </div>
            )}
          </div>
        </header>

        <div className="p-4 sm:p-6 lg:p-8">
          <Outlet />
        </div>
      </main>

      {/* =====================================================
          MOBILE BOTTOM NAVIGATION
      ====================================================== */}

      <MobileBottomNav
        role={role}
        dashboardPath={
          dashboardPath
        }
        location={
          location
        }
        mobileClass={
          mobileClass
        }
        onProtectedNav={
          handleProtectedNav
        }
      />
    </div>
  );
}

/* =========================================================
   MOBILE BOTTOM NAV
========================================================= */

function MobileBottomNav({
  role,
  dashboardPath,
  location,
  mobileClass,
  onProtectedNav,
}) {
  const isNormalUser =
    role === "user";

  const isContentCreator =
    role ===
    "contentcreator";

  if (isNormalUser) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-3 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 items-center gap-1">
          <NavLink
            to="/user/home"
            end
            className={
              mobileClass
            }
          >
            <Home size={21} />
            Home
          </NavLink>

          <NavLink
            to="/live-shop"
            className={
              mobileClass
            }
          >
            <Radio size={21} />
            Live
          </NavLink>

          <NavLink
            to="/live-shop"
            className={
              mobileClass
            }
          >
            <ShoppingBag
              size={21}
            />
            Shop
          </NavLink>

          <NavLink
            to="/user/wishlist"
            className={
              mobileClass
            }
          >
            <Heart size={21} />
            Wishlist
          </NavLink>

          <NavLink
            to="/user/profile"
            className={
              mobileClass
            }
          >
            <UserRound
              size={21}
            />
            Profile
          </NavLink>
        </div>
      </nav>
    );
  }

  if (isContentCreator) {
    return (
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-3 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
        <div className="grid grid-cols-5 items-center gap-1">
          <NavLink
            to={dashboardPath}
            end
            className={
              mobileClass
            }
          >
            <Home size={21} />
            Home
          </NavLink>

          <NavLink
            to="/app/twin"
            className={
              mobileClass
            }
          >
            <UserRound
              size={21}
            />
            Twins
          </NavLink>

          <NavLink
            to="/app/products"
            className={
              mobileClass
            }
          >
            <Package size={21} />
            Products
          </NavLink>

          <NavLink
            to="/app/schedule"
            className={
              mobileClass
            }
          >
            <Calendar size={21} />
            Schedule
          </NavLink>

          <NavLink
            to="/app/analytics"
            className={
              mobileClass
            }
          >
            <BarChart3
              size={21}
            />
            Analytics
          </NavLink>
        </div>
      </nav>
    );
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-card/95 px-3 py-2 shadow-[0_-8px_30px_rgba(0,0,0,0.08)] backdrop-blur lg:hidden">
      <div className="grid grid-cols-5 items-center gap-1">
        <NavLink
          to={dashboardPath}
          end
          className={
            mobileClass
          }
        >
          <Home size={21} />
          Home
        </NavLink>

        <NavLink
          to="/app/twin"
          className={() =>
            `flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition ${
              location.pathname.startsWith(
                "/app/twin"
              )
                ? "text-[var(--brand-pink)]"
                : "text-muted-foreground"
            }`
          }
        >
          <UserRound
            size={21}
          />
          Twin
        </NavLink>

        <button
          onClick={() =>
            onProtectedNav(
              "/app/products"
            )
          }
          className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition ${
            location.pathname.startsWith(
              "/app/products"
            )
              ? "text-[var(--brand-pink)]"
              : "text-muted-foreground"
          }`}
        >
          <Package size={21} />
          Products
        </button>

        <button
          onClick={() =>
            onProtectedNav(
              "/app/golive"
            )
          }
          className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition ${
            location.pathname.startsWith(
              "/app/golive"
            )
              ? "text-[var(--brand-pink)]"
              : "text-muted-foreground"
          }`}
        >
          <Radio size={24} />
          Live
        </button>

        <button
          onClick={() =>
            onProtectedNav(
              "/app/schedule"
            )
          }
          className={`flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1 text-[11px] font-bold transition ${
            location.pathname.startsWith(
              "/app/schedule"
            )
              ? "text-[var(--brand-pink)]"
              : "text-muted-foreground"
          }`}
        >
          <Calendar size={21} />
          Schedule
        </button>
      </div>
    </nav>
  );
}

/* =========================================================
   SMALL COMPONENTS
========================================================= */

function LogoBlock({
  compact = false,
  mobile = false,
  subtitle =
    "Never sleep. Never stop selling.",
  onClick,
}) {
  const size =
    compact
      ? "h-10 w-10"
      : mobile
        ? "h-11 w-11"
        : "h-14 w-14";

  return (
    <Link
      to="/"
      onClick={
        onClick
      }
    >
      <div className="flex items-center gap-3">
        <div className={`flex ${size} items-center justify-center`}>
          <img
            src="/images/logos.png"
            alt="Twin Logo"
            className={`${size} rounded-xl object-contain`}
          />
        </div>

        <div>
          <h1
            className="tracking-tight text-2xl font-black"
            style={{
              fontWeight: 600,
              fontFamily:
                "Poppins, sans-serif",
            }}
          >
            twinn
            <span className="brand-text">
              .
            </span>
            live
          </h1>

          <p
            className={`${
              compact
                ? "text-[10px] text-muted-foreground"
                : "text-xs text-pink-300"
            }`}
          >
            {subtitle}
          </p>
        </div>
      </div>
    </Link>
  );
}

function RoleBadge({
  role,
  roleLabel,
  isPro,
  plan,
}) {
  let Icon =
    Sparkles;

  let text =
    roleLabel.toUpperCase();

  if (
    role === "admin" ||
    role === "manager"
  ) {
    Icon =
      ShieldCheck;

    text =
      `${roleLabel.toUpperCase()} ACCESS`;
  } else if (
    role ===
    "brandcreator"
  ) {
    Icon =
      isPro
        ? Crown
        : Sparkles;

    text =
      isPro
        ? `${(plan || "PRO").toUpperCase()} PLAN ACTIVE`
        : "FREE PLAN";
  } else if (
    role ===
    "contentcreator"
  ) {
    Icon =
      Video;

    text =
      "CONTENT CREATOR";
  } else {
    Icon =
      UserRound;

    text =
      "NORMAL USER";
  }

  return (
    <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl border border-white/10 bg-white/10 px-4 py-3 text-sm font-black text-white">
      <Icon className="h-4 w-4 text-pink-300" />
      {text}
    </div>
  );
}

function TwinCard({
  loading,
  hasTwin,
  twinName,
  twinImage,
  isPro,
  compact = false,
  canCreateTwin,
  onCreate,
}) {
  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur">
      {loading ? (
        <div className="py-10 text-center text-sm font-bold text-white/60">
          Loading AI Twin...
        </div>
      ) : hasTwin ? (
        <>
          <div className="rounded-3xl bg-black/20 p-3">
            <img
              src={twinImage}
              alt="AI Twin"
              className={`mx-auto w-full rounded-[5px] object-contain ${
                compact
                  ? "h-32"
                  : "h-40"
              }`}
            />
          </div>

          <h2 className="mt-4 text-center text-xl font-black">
            {twinName}
          </h2>

          <p className="mt-1 text-center text-sm font-bold text-emerald-400">
            ● Online
          </p>

          <p className="mt-2 text-center text-xs font-black text-pink-300">
            {isPro
              ? "PRO AI TWIN"
              : "AI TWIN"}
          </p>
        </>
      ) : (
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-white/10">
            <Sparkles className="h-7 w-7 text-pink-300" />
          </div>

          <p className="mt-4 text-lg font-black">
            No AI Twin Yet
          </p>

          <p className="mt-1 text-sm text-white/60">
            {canCreateTwin
              ? "Create your selling twin first."
              : "No AI Twin has been assigned."}
          </p>

          {canCreateTwin && (
            <button
              onClick={
                onCreate
              }
              className="brand-gradient mt-5 w-full rounded-[5px] py-3 text-sm font-bold text-white"
            >
              Create AI Twin
            </button>
          )}
        </div>
      )}
    </div>
  );
}

function UserCard({
  user,
  compact = false,
}) {
  const displayName =
    user?.fullName ||
    user?.name ||
    user?.email?.split(
      "@"
    )?.[0] ||
    "User";

  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-white/10 p-5 text-center backdrop-blur">
      <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-white/10">
        <UserRound className="h-8 w-8 text-pink-300" />
      </div>

      <h2 className="mt-4 text-lg font-black">
        {displayName}
      </h2>

      <p className="mt-1 text-xs text-white/60">
        {user?.email ||
          "Customer account"}
      </p>

      {!compact && (
        <p className="mt-3 text-xs font-black text-pink-300">
          CUSTOMER ACCOUNT
        </p>
      )}
    </div>
  );
}

function MenuTitle({
  title,
}) {
  return (
    <p className="mb-2 mt-6 px-5 text-[11px] font-black uppercase tracking-[0.2em] text-white/35">
      {title}
    </p>
  );
}

function SidebarButton({
  icon: Icon,
  text,
  onClick,
  active = false,
}) {
  return (
    <button
      onClick={
        onClick
      }
      className={`flex w-full items-center gap-3 rounded-2xl px-5 py-3.5 text-sm font-bold transition-all duration-300 ${
        active
          ? "brand-gradient text-white shadow-lg shadow-pink-500/20"
          : "text-white/70 hover:translate-x-1 hover:bg-white/10 hover:text-white"
      }`}
    >
      <Icon size={18} />
      {text}
    </button>
  );
}