import { inject } from "vue";
import { store } from "./store";

export const guardKey = "guard";

export function useGuard(key = null) {
  return inject(key !== null ? key : guardKey);
}

const ROLE_GUEST = "guest";
const ROLE_USER = "user";
const ROLE_ADMIN = "admin";
const ROLE_GOD = "god";

// 按照权限从小到大排序
const roles = [
  // 访客
  ROLE_GUEST,
  // 登录用户
  ROLE_USER,
  // 该角色可以展示一些隐藏入口，也可以突破对 creator 的限制
  ROLE_ADMIN,
  // 该角色拥有所有权限，可在 debug 时启用
  ROLE_GOD,
];

const MEMBER_VISITOR = "visitor";
const MEMBER_MEMBER = "member";
const MEMBER_MANAGER = "manager";
const MEMBER_EXECUTOR = "executor";
const MEMBER_CREATOR = "creator";
// 这里的成员角色是指角色与 resource 的关系
// 比如有一个 team，邀请一个 visitor 成为 member，再设置成管理员为 owner
// 其中 creator 有最高权限，如果有一个 entry 不希望 creator 操作，可以提高 roleLevel 到 admin
const members = [
  // 这三个角色是与 group 相关
  MEMBER_VISITOR,
  MEMBER_MEMBER,
  MEMBER_MANAGER,

  // 下面两个角色是与 entry 相关，entry 角色会高于 group 角色
  MEMBER_EXECUTOR,
  MEMBER_CREATOR,
];

const getRolesByLevel = (level = ROLE_GUEST) => {
  if (typeof level === "string") {
    level = roles.indexOf(level);
  }
  return roles.slice(level);
};

const getMembersByLevel = (level = MEMBER_VISITOR) => {
  if (typeof level === "string") {
    level = members.indexOf(level);
  }
  return members.slice(level);
};

const generatePermissionEntry = (options) => ({
  // 最低访问权限
  roles: getRolesByLevel(ROLE_GUEST),
  members: getMembersByLevel(MEMBER_VISITOR),
  ...options,
});

// 这份表是对 Roles + Members 的组合配置
// action 命名规则：resource.requestMethod.type?
// 如果某一个 action 没有找到 type，则会向上一级查找，示例：
// - chat.create.message
// - chat.create
// - chat
const permissionConfigMap = {
  "chat.create": generatePermissionEntry({
    roles: getRolesByLevel(ROLE_USER),
  }),
  "chat.update": generatePermissionEntry({
    roles: getRolesByLevel(ROLE_ADMIN),
  }),
  "chat.read": generatePermissionEntry({
    roles: getRolesByLevel(ROLE_GUEST),
  }),
  "chat.delete": generatePermissionEntry({
    roles: getRolesByLevel(ROLE_USER),
    members: getMembersByLevel(MEMBER_MANAGER),
  }),
};

class GuardManager {
  install(app, injectKey) {
    app.provide(injectKey || guardKey, this);
    app.config.globalProperties.$guard = this;
  }

  get user() {
    return store.state.user;
  }

  get isAuthed() {
    return store.getters.isAuthed;
  }

  isMe(userId) {
    const currentUser = store.state.user;

    return currentUser.userId === userId;
  }

  // guard 只知道当前用户的 role，并不知道 member 与 resource 的关系
  // 如果一个权限涉及到 resource 的权限检测，需要传 resource 进来
  // 使用方法 v-if="$guard.check(action, { resource })"
  // 如果 resource 中直接包含了权限判断字段，则应该直接用 v-if="resource.canUpdate"
  check(action, { resource, resourceType, roleType } = {}) {
    const currentUser = store.state.user;

    if (!roleType) {
      roleType = currentUser.type;
    }

    // god 拥有所有权限
    if (roleType === ROLE_GOD) {
      return true;
    }

    // 找到 action 对应的权限配置
    const actionPermissionEntry = this.getPermissionEntryConfig(action);
    // 如果找不到则认为有权限
    if (!actionPermissionEntry) {
      console.warn(`未找到 ${action} 对应的权限配置，默认为有权限`);
      return true;
    }

    // 根据 resource 确认 memberType
    const memberType = this.getMemberTypeByResource(resource, resourceType);

    // role, member 同时获得权限则为 true
    return [
      () => this.hasRolePermission(roleType, actionPermissionEntry.roles),
      () => this.hasMemberPermission(memberType, actionPermissionEntry.members),
    ].every((fn) => fn());
  }

  // @TODO：这里理论上可以通过 store.state.context 中的数据来辅助判断 memberType
  // resourceType 需要根据具体业务来增加，可能会有：project, team, channel, message
  // 需要对数据做一遍清晰，方便统一判断
  getMemberTypeByResource(resource, resourceType) {
    let memberType = MEMBER_VISITOR;

    if (!resource) {
      return memberType;
    }

    if (this.isMe(resource.creatorId)) {
      return MEMBER_CREATOR;
    }

    return memberType;
  }

  hasRolePermission(currentRole, grantRoles) {
    return grantRoles.includes(currentRole);
  }

  hasMemberPermission(currentMember, grantMembers) {
    return grantMembers.includes(currentMember);
  }

  getPermissionEntryConfig(action) {
    let entryConfig = permissionConfigMap[action];

    if (entryConfig) {
      return entryConfig;
    }

    const actionFrags = action.split(".");

    if (actionFrags.length >= 2) {
      entryConfig =
        permissionConfigMap[actionFrags.slice(0, 2).join(".")] ||
        permissionConfigMap[actionFrags.slice(0, 1).join(".")];
    }

    return entryConfig;
  }

  // 这个 permissionsMap 只能检测通用权限
  getPermissionsMap(roleType) {
    const map = {};

    Object.keys(permissionConfigMap).map((action) => {
      map[action] = this.check(action, { roleType });
    });

    return map;
  }
}

export const guard = new GuardManager();
