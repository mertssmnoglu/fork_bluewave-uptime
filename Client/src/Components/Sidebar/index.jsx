import React, { useEffect, useState } from "react";
import {
	Box,
	Collapse,
	Divider,
	IconButton,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	ListSubheader,
	Menu,
	MenuItem,
	Stack,
	Tooltip,
	Typography,
} from "@mui/material";
import { useLocation, useNavigate } from "react-router";
import { useTheme } from "@emotion/react";
import { useDispatch, useSelector } from "react-redux";
import { clearAuthState } from "../../Features/Auth/authSlice";
import { toggleSidebar } from "../../Features/UI/uiSlice";
import { clearUptimeMonitorState } from "../../Features/UptimeMonitors/uptimeMonitorsSlice";
import ThemeSwitch from "../ThemeSwitch";
import Avatar from "../Avatar";
import LockSvg from "../../assets/icons/lock.svg?react";
import UserSvg from "../../assets/icons/user.svg?react";
import TeamSvg from "../../assets/icons/user-two.svg?react";
import LogoutSvg from "../../assets/icons/logout.svg?react";
import Support from "../../assets/icons/support.svg?react";
import Account from "../../assets/icons/user-edit.svg?react";
import Maintenance from "../../assets/icons/maintenance.svg?react";
import Monitors from "../../assets/icons/monitors.svg?react";
import Incidents from "../../assets/icons/incidents.svg?react";
import Integrations from "../../assets/icons/integrations.svg?react";
import PageSpeed from "../../assets/icons/page-speed.svg?react";
import Settings from "../../assets/icons/settings.svg?react";
import ArrowDown from "../../assets/icons/down-arrow.svg?react";
import ArrowUp from "../../assets/icons/up-arrow.svg?react";
import ArrowRight from "../../assets/icons/right-arrow.svg?react";
import ArrowLeft from "../../assets/icons/left-arrow.svg?react";
import DotsVertical from "../../assets/icons/dots-vertical.svg?react";
import ChangeLog from "../../assets/icons/changeLog.svg?react";
import Docs from "../../assets/icons/docs.svg?react";
import Folder from "../../assets/icons/folder.svg?react";
import ChatBubbleOutlineRoundedIcon from "@mui/icons-material/ChatBubbleOutlineRounded";

import "./index.css";

const menu = [
	{ name: "Uptime", path: "uptime", icon: <Monitors /> },
	{ name: "Pagespeed", path: "pagespeed", icon: <PageSpeed /> },
	{ name: "Infrastructure", path: "infrastructure", icon: <Integrations /> },
	{ name: "Incidents", path: "incidents", icon: <Incidents /> },
	// { name: "Status pages", path: "status", icon: <StatusPages /> },
	{ name: "Maintenance", path: "maintenance", icon: <Maintenance /> },
	// { name: "Integrations", path: "integrations", icon: <Integrations /> },
	{
		name: "Account",
		icon: <Account />,
		nested: [
			{ name: "Profile", path: "account/profile", icon: <UserSvg /> },
			{ name: "Password", path: "account/password", icon: <LockSvg /> },
			{ name: "Team", path: "account/team", icon: <TeamSvg /> },
		],
	},
	{
		name: "Settings",
		icon: <Settings />,
		path: "settings",
	},
	{
		name: "Other",
		icon: <Folder />,
		nested: [
			{ name: "Support", path: "support", icon: <Support /> },
			{
				name: "Discussions",
				path: "discussions",
				icon: <ChatBubbleOutlineRoundedIcon />,
			},
			{ name: "Docs", path: "docs", icon: <Docs /> },
			{ name: "Changelog", path: "changelog", icon: <ChangeLog /> },
		],
	},
];

/* TODO this could be a key in nested Path would be the link */
const URL_MAP = {
	support: "https://discord.com/invite/NAb6H3UTjK",
	discussions: "https://github.com/bluewave-labs/checkmate/discussions",
	docs: "https://bluewavelabs.gitbook.io/checkmate",
	changelog: "https://github.com/bluewave-labs/bluewave-uptime/releases",
};

const PATH_MAP = {
	monitors: "Dashboard",
	pagespeed: "Dashboard",
	infrastructure: "Dashboard",
	account: "Account",
	settings: "Settings",
};

/**
 * @component
 * Sidebar component serves as a sidebar containing a menu.
 *
 * @returns {JSX.Element} The JSX element representing the Sidebar component.
 */

function Sidebar() {
	const theme = useTheme();
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch();
	const authState = useSelector((state) => state.auth);
	const collapsed = useSelector((state) => state.ui.sidebar.collapsed);
	const [open, setOpen] = useState({ Dashboard: false, Account: false, Other: false });
	const [anchorEl, setAnchorEl] = useState(null);
	const [popup, setPopup] = useState();
	const { user } = useSelector((state) => state.auth);

	const accountMenuItem = menu.find((item) => item.name === "Account");
	if (user.role?.includes("demo") && accountMenuItem) {
		accountMenuItem.nested = accountMenuItem.nested.filter((item) => {
			return item.name !== "Password";
		});
	}

	const openPopup = (event, id) => {
		setAnchorEl(event.currentTarget);
		setPopup(id);
	};
	const closePopup = () => {
		setAnchorEl(null);
	};

	/**
	 * Handles logging out the user
	 *
	 */
	const logout = async () => {
		// Clear auth state
		dispatch(clearAuthState());
		dispatch(clearUptimeMonitorState());
		navigate("/login");
	};

	useEffect(() => {
		const matchedKey = Object.keys(PATH_MAP).find((key) =>
			location.pathname.includes(key)
		);

		if (matchedKey) {
			setOpen((prev) => ({ ...prev, [PATH_MAP[matchedKey]]: true }));
		}
	}, [location]);

	/* TODO refactor this, there are a some ternaries and comments in the return  */
	return (
		<Stack
			component="aside"
			className={collapsed ? "collapsed" : "expanded"}
			py={theme.spacing(6)}
			gap={theme.spacing(6)}
			sx={{
				border: 1,
				borderColor: theme.palette.primary.lowContrast,
				borderRadius: theme.shape.borderRadius,
				/* TODO selected item */
				"& .selected-path": {
					/* TODO lookup theme.palette.tertiary.main */
					backgroundColor: theme.palette.secondary.main /* theme.palette.tertiary.main */,

					/* TODO not working */
					color: theme.palette.primary.main,
				},
				" & .MuiListItemButton-root:hover": {
					backgroundColor: theme.palette.tertiary.main,
					/* TODO try and change color */
					color: theme.palette.secondary.main,
				},
				"& .MuiList-root svg path": {
					stroke: theme.palette.primary.contrastText.tertiary,
				},
				"& p, & span, & .MuiListSubheader-root": {
					color: theme.palette.primary.contrastText.secondary,
				},
			}}
		>
			<IconButton
				sx={{
					position: "absolute",
					/* TODO 60 is a magic number. if logo chnges size this might break */
					top: 60,
					right: 0,
					transform: `translate(50%, 0)`,
					backgroundColor: theme.palette.tertiary.main,
					border: 1,
					borderColor: theme.palette.primary.lowContrast,
					p: theme.spacing(2.5),
					"& svg": {
						width: theme.spacing(8),
						height: theme.spacing(8),
						"& path": {
							stroke: theme.palette.primary.contrastText.secondary,
						},
					},
					"&:focus": { outline: "none" },
					"&:hover": {
						backgroundColor: theme.palette.primary.lowContrast,
						borderColor: theme.palette.primary.lowContrast,
					},
				}}
				onClick={() => {
					setOpen((prev) =>
						Object.fromEntries(Object.keys(prev).map((key) => [key, false]))
					);
					dispatch(toggleSidebar());
				}}
			>
				{collapsed ? <ArrowRight /> : <ArrowLeft />}
			</IconButton>

			{/* TODO Alignment done using padding. Use single source of truth to that*/}
			<Stack
				pt={theme.spacing(6)}
				pb={theme.spacing(12)}
				pl={theme.spacing(8)}
			>
				{/* TODO Abstract logo into component */}
				{/* TODO Turn logo into a link */}
				<Stack
					direction="row"
					alignItems="center"
					gap={theme.spacing(4)}
					onClick={() => navigate("/")}
					sx={{ cursor: "pointer" }}
				>
					<Stack
						justifyContent="center"
						alignItems="center"
						minWidth={theme.spacing(16)}
						minHeight={theme.spacing(16)}
						pl="1px"
						fontSize={18}
						color="white"
						sx={{
							position: "relative",
							backgroundColor: theme.palette.accent.main,
							color: theme.palette.accent.contrastText,
							borderRadius: theme.shape.borderRadius,
							userSelect: "none",
						}}
					>
						C
					</Stack>
					<Typography
						component="span"
						mt={theme.spacing(2)}
						sx={{ opacity: 0.8, fontWeight: 500 }}
					>
						Checkmate
					</Typography>
				</Stack>
			</Stack>
			{/* menu */}
			<List
				component="nav"
				aria-labelledby="nested-menu-subheader"
				disablePadding
				subheader={
					/* TODO Increase Menu bottom spacing */
					<ListSubheader
						component="div"
						id="nested-menu-subheader"
						sx={{
							pt: theme.spacing(4),
							px: collapsed ? theme.spacing(2) : theme.spacing(4),
							backgroundColor: "transparent",
						}}
					>
						Menu
					</ListSubheader>
				}
				sx={{
					px: theme.spacing(6),
					height: "100%",
					overflow: "hidden",
				}}
			>
				{menu.map((item) =>
					item.path ? (
						<Tooltip
							key={item.path}
							placement="right"
							title={collapsed ? item.name : ""}
							slotProps={{
								popper: {
									modifiers: [
										{
											name: "offset",
											options: {
												offset: [0, -16],
											},
										},
									],
								},
							}}
							disableInteractive
						>
							<ListItemButton
								className={location.pathname.includes(item.path) ? "selected-path" : ""}
								onClick={() => navigate(`/${item.path}`)}
								sx={{
									/* TODO fixed height */ height: "37px",
									gap: theme.spacing(4),
									borderRadius: theme.shape.borderRadius,
									px: theme.spacing(4),
								}}
							>
								<ListItemIcon sx={{ minWidth: 0 }}>{item.icon}</ListItemIcon>
								<ListItemText>{item.name}</ListItemText>
							</ListItemButton>
						</Tooltip>
					) : collapsed ? (
						/* TODO Do we ever get here? */
						<React.Fragment key={item.name}>
							<Tooltip
								placement="right"
								title={collapsed ? item.name : ""}
								slotProps={{
									popper: {
										modifiers: [
											{
												name: "offset",
												options: {
													offset: [0, -16],
												},
											},
										],
									},
								}}
								disableInteractive
							>
								<ListItemButton
									className={
										Boolean(anchorEl) && popup === item.name ? "selected-path" : ""
									}
									onClick={(event) => openPopup(event, item.name)}
									sx={{
										position: "relative",
										gap: theme.spacing(4),
										borderRadius: theme.shape.borderRadius,
										px: theme.spacing(4),
									}}
								>
									<ListItemIcon sx={{ minWidth: 0 }}>{item.icon}</ListItemIcon>
									<ListItemText>{item.name}</ListItemText>
								</ListItemButton>
							</Tooltip>
							<Menu
								className="sidebar-popup"
								anchorEl={anchorEl}
								open={Boolean(anchorEl) && popup === item.name}
								onClose={closePopup}
								disableScrollLock
								anchorOrigin={{
									vertical: "top",
									horizontal: "right",
								}}
								slotProps={{
									paper: {
										sx: {
											mt: theme.spacing(-2),
											ml: theme.spacing(1),
										},
									},
								}}
								MenuListProps={{ sx: { px: 1, py: 2 } }}
								sx={{
									ml: theme.spacing(8),
									"& .selected-path": {
										backgroundColor: theme.palette.tertiary.main,
									},
								}}
							>
								{item.nested.map((child) => {
									if (
										child.name === "Team" &&
										authState.user?.role &&
										!authState.user.role.includes("superadmin")
									) {
										return null;
									}

									return (
										<MenuItem
											className={
												location.pathname.includes(child.path) ? "selected-path" : ""
											}
											key={child.path}
											onClick={() => {
												const url = URL_MAP[child.path];
												if (url) {
													window.open(url, "_blank", "noreferrer");
												} else {
													navigate(`/${child.path}`);
												}
												closePopup();
											}}
											sx={{
												gap: theme.spacing(4),
												opacity: 0.9,
												"& svg": {
													"& path": {
														stroke: theme.palette.primary.contrastText.tertiary,
														strokeWidth: 1.1,
													},
												},
											}}
										>
											{child.icon}
											{child.name}
										</MenuItem>
									);
								})}
							</Menu>
						</React.Fragment>
					) : (
						<React.Fragment key={item.name}>
							<ListItemButton
								onClick={() =>
									setOpen((prev) => ({
										...Object.fromEntries(Object.keys(prev).map((key) => [key, false])),
										[item.name]: !prev[item.name],
									}))
								}
								sx={{
									gap: theme.spacing(4),
									borderRadius: theme.shape.borderRadius,
									px: theme.spacing(4),
								}}
							>
								<ListItemIcon sx={{ minWidth: 0 }}>{item.icon}</ListItemIcon>
								<ListItemText>{item.name}</ListItemText>
								{open[`${item.name}`] ? <ArrowUp /> : <ArrowDown />}
							</ListItemButton>
							<Collapse
								in={open[`${item.name}`]}
								timeout="auto"
							>
								<List
									component="div"
									disablePadding
									sx={{ pl: theme.spacing(12) }}
								>
									{item.nested.map((child) => {
										if (
											child.name === "Team" &&
											authState.user?.role &&
											!authState.user.role.includes("superadmin")
										) {
											return null;
										}

										return (
											<ListItemButton
												className={
													location.pathname.includes(child.path) ? "selected-path" : ""
												}
												key={child.path}
												onClick={() => {
													const url = URL_MAP[child.path];
													if (url) {
														window.open(url, "_blank", "noreferrer");
													} else {
														navigate(`/${child.path}`);
													}
												}}
												sx={{
													gap: theme.spacing(4),
													borderRadius: theme.shape.borderRadius,
													pl: theme.spacing(4),
													"&::before": {
														content: `""`,
														position: "absolute",
														top: 0,
														left: "-7px",
														height: "100%",
														borderLeft: 1,
														borderLeftColor: theme.palette.primary.lowContrast,
													},
													"&:last-child::before": {
														height: "50%",
													},
													"&::after": {
														content: `""`,
														position: "absolute",
														top: "45%",
														left: "-8px",
														height: "3px",
														width: "3px",
														borderRadius: "50%",
														backgroundColor: theme.palette.primary.lowContrast,
													},
													"&.selected-path::after": {
														backgroundColor: theme.palette.primary.contrastText.tertiary,
														transform: "scale(1.2)",
													},
												}}
											>
												<ListItemIcon sx={{ minWidth: 0 }}>{child.icon}</ListItemIcon>
												<ListItemText>{child.name}</ListItemText>
											</ListItemButton>
										);
									})}
								</List>
							</Collapse>
						</React.Fragment>
					)
				)}
			</List>
			<Divider sx={{ mt: "auto" }} />

			<Stack
				direction="row"
				height="50px"
				alignItems="center"
				py={theme.spacing(4)}
				px={theme.spacing(8)}
				gap={theme.spacing(2)}
				borderRadius={theme.shape.borderRadius}
			>
				{collapsed ? (
					<>
						<Tooltip
							title="Options"
							slotProps={{
								popper: {
									modifiers: [
										{
											name: "offset",
											options: {
												offset: [0, -10],
											},
										},
									],
								},
							}}
							disableInteractive
						>
							<IconButton
								onClick={(event) => openPopup(event, "logout")}
								sx={{ p: 0, "&:focus": { outline: "none" } }}
							>
								<Avatar small={true} />
							</IconButton>
						</Tooltip>
					</>
				) : (
					<>
						<Avatar small={true} />
						<Box ml={theme.spacing(2)}>
							<Typography
								component="span"
								fontWeight={500}
							>
								{authState.user?.firstName} {authState.user?.lastName}
							</Typography>
							<Typography sx={{ textTransform: "capitalize" }}>
								{authState.user?.role}
							</Typography>
						</Box>
						<Stack
							flexDirection={"row"}
							marginLeft={"auto"}
							columnGap={theme.spacing(2)}
						>
							<ThemeSwitch />
							<Tooltip
								title="Controls"
								disableInteractive
							>
								<IconButton
									sx={{
										ml: "auto",
										mr: "-8px",
										"&:focus": { outline: "none" },
										alignSelf: "center",
										padding: "10px",

										"& svg": {
											width: "22px",
											height: "22px",
										},
										"& svg path": {
											stroke: theme.palette.primary.contrastText.tertiary,
										},
									}}
									onClick={(event) => openPopup(event, "logout")}
								>
									<DotsVertical />
								</IconButton>
							</Tooltip>
						</Stack>
					</>
				)}
				<Menu
					className="sidebar-popup"
					anchorEl={anchorEl}
					open={Boolean(anchorEl) && popup === "logout"}
					onClose={closePopup}
					disableScrollLock
					anchorOrigin={{
						vertical: "top",
						horizontal: "right",
					}}
					slotProps={{
						paper: {
							sx: {
								marginTop: theme.spacing(-4),
								marginLeft: collapsed ? theme.spacing(2) : 0,
							},
						},
					}}
					MenuListProps={{
						sx: {
							p: 2,
							"& li": { m: 0 },
							"& li:has(.MuiBox-root):hover": {
								backgroundColor: "transparent",
							},
						},
					}}
					sx={{
						ml: theme.spacing(8),
					}}
				>
					{collapsed && (
						<MenuItem sx={{ cursor: "default", minWidth: "150px" }}>
							<Box mb={theme.spacing(2)}>
								<Typography
									component="span"
									fontWeight={500}
									fontSize={13}
								>
									{authState.user?.firstName} {authState.user?.lastName}
								</Typography>
								<Typography sx={{ textTransform: "capitalize", fontSize: 12 }}>
									{authState.user?.role}
								</Typography>
							</Box>
						</MenuItem>
					)}
					{collapsed && <Divider />}
					<Divider />
					<MenuItem
						onClick={logout}
						sx={{
							gap: theme.spacing(4),
							borderRadius: theme.shape.borderRadius,
							pl: theme.spacing(4),
							"& svg path": {
								stroke: theme.palette.primary.contrastText.tertiary,
							},
						}}
					>
						<LogoutSvg />
						Log out
					</MenuItem>
				</Menu>
			</Stack>
		</Stack>
	);
}

export default Sidebar;
