import { isMockService } from '../config/appConfig'

/**
 * Central service layer.
 *
 * The UI imports from here and never knows whether it is talking to the mock
 * or Firebase implementation. Switching `isMockService` in `appConfig.ts`
 * changes the entire data source.
 *
 * Dynamic imports are used so the Firebase SDK is only loaded when mock mode
 * is disabled — in mock mode no Firebase code is bundled or run.
 */

async function load<T extends Record<string, unknown>>(
  mock: () => Promise<T>,
  firebase: () => Promise<T>,
): Promise<T> {
  return isMockService ? mock() : firebase()
}

export const machineService = {
  getMachines: (...args: Parameters<typeof import('./mock/mockMachineService')['getMachines']>) =>
    load(
      () => import('./mock/mockMachineService'),
      () => import('./firebase/machineService'),
    ).then((m) => m.getMachines(...args)),
  getMachineByCode: (...args: Parameters<typeof import('./mock/mockMachineService')['getMachineByCode']>) =>
    load(
      () => import('./mock/mockMachineService'),
      () => import('./firebase/machineService'),
    ).then((m) => m.getMachineByCode(...args)),
  getMachineById: (...args: Parameters<typeof import('./mock/mockMachineService')['getMachineById']>) =>
    load(
      () => import('./mock/mockMachineService'),
      () => import('./firebase/machineService'),
    ).then((m) => m.getMachineById(...args)),
  getAllMachines: (...args: Parameters<typeof import('./mock/mockMachineService')['getAllMachines']>) =>
    load(
      () => import('./mock/mockMachineService'),
      () => import('./firebase/machineService'),
    ).then((m) => m.getAllMachines(...args)),
  createMachine: (...args: Parameters<typeof import('./mock/mockMachineService')['createMachine']>) =>
    load(
      () => import('./mock/mockMachineService'),
      () => import('./firebase/machineService'),
    ).then((m) => m.createMachine(...args)),
  updateMachine: (...args: Parameters<typeof import('./mock/mockMachineService')['updateMachine']>) =>
    load(
      () => import('./mock/mockMachineService'),
      () => import('./firebase/machineService'),
    ).then((m) => m.updateMachine(...args)),
  deleteMachine: (...args: Parameters<typeof import('./mock/mockMachineService')['deleteMachine']>) =>
    load(
      () => import('./mock/mockMachineService'),
      () => import('./firebase/machineService'),
    ).then((m) => m.deleteMachine(...args)),
  recordMachineVisit: (...args: Parameters<typeof import('./mock/mockMachineService')['recordMachineVisit']>) =>
    load(
      () => import('./mock/mockMachineService'),
      () => import('./firebase/machineService'),
    ).then((m) => m.recordMachineVisit(...args)),
}

export const productService = {
  getProducts: (...args: Parameters<typeof import('./mock/mockProductService')['getProducts']>) =>
    load(
      () => import('./mock/mockProductService'),
      () => import('./firebase/productService'),
    ).then((m) => m.getProducts(...args)),
  getActiveProducts: (...args: Parameters<typeof import('./mock/mockProductService')['getActiveProducts']>) =>
    load(
      () => import('./mock/mockProductService'),
      () => import('./firebase/productService'),
    ).then((m) => m.getActiveProducts(...args)),
  searchProducts: (...args: Parameters<typeof import('./mock/mockProductService')['searchProducts']>) =>
    load(
      () => import('./mock/mockProductService'),
      () => import('./firebase/productService'),
    ).then((m) => m.searchProducts(...args)),
  getProductsByCategory: (...args: Parameters<typeof import('./mock/mockProductService')['getProductsByCategory']>) =>
    load(
      () => import('./mock/mockProductService'),
      () => import('./firebase/productService'),
    ).then((m) => m.getProductsByCategory(...args)),
  getProductById: (...args: Parameters<typeof import('./mock/mockProductService')['getProductById']>) =>
    load(
      () => import('./mock/mockProductService'),
      () => import('./firebase/productService'),
    ).then((m) => m.getProductById(...args)),
}

export const issueService = {
  getIssues: (...args: Parameters<typeof import('./mock/mockIssueService')['getIssues']>) =>
    load(
      () => import('./mock/mockIssueService'),
      () => import('./firebase/issueService'),
    ).then((m) => m.getIssues(...args)),
  getIssueByReference: (...args: Parameters<typeof import('./mock/mockIssueService')['getIssueByReference']>) =>
    load(
      () => import('./mock/mockIssueService'),
      () => import('./firebase/issueService'),
    ).then((m) => m.getIssueByReference(...args)),
  createIssue: (...args: Parameters<typeof import('./mock/mockIssueService')['createIssue']>) =>
    load(
      () => import('./mock/mockIssueService'),
      () => import('./firebase/issueService'),
    ).then((m) => m.createIssue(...args)),
  updateIssueStatus: (...args: Parameters<typeof import('./mock/mockIssueService')['updateIssueStatus']>) =>
    load(
      () => import('./mock/mockIssueService'),
      () => import('./firebase/issueService'),
    ).then((m) => m.updateIssueStatus(...args)),
}

export const requestService = {
  getProductRequests: (...args: Parameters<typeof import('./mock/mockRequestService')['getProductRequests']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.getProductRequests(...args)),
  getProductRequestByReference: (...args: Parameters<typeof import('./mock/mockRequestService')['getProductRequestByReference']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.getProductRequestByReference(...args)),
  createProductRequest: (...args: Parameters<typeof import('./mock/mockRequestService')['createProductRequest']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.createProductRequest(...args)),
  updateProductRequestStatus: (...args: Parameters<typeof import('./mock/mockRequestService')['updateProductRequestStatus']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.updateProductRequestStatus(...args)),
  getRequestedProducts: (...args: Parameters<typeof import('./mock/mockRequestService')['getRequestedProducts']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.getRequestedProducts(...args)),
  getAllRequestedProducts: (...args: Parameters<typeof import('./mock/mockRequestService')['getAllRequestedProducts']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.getAllRequestedProducts(...args)),
  getRequestedProductById: (...args: Parameters<typeof import('./mock/mockRequestService')['getRequestedProductById']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.getRequestedProductById(...args)),
  findRequestedProduct: (...args: Parameters<typeof import('./mock/mockRequestService')['findRequestedProduct']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.findRequestedProduct(...args)),
  createRequestedProduct: (...args: Parameters<typeof import('./mock/mockRequestService')['createRequestedProduct']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.createRequestedProduct(...args)),
  updateRequestedProduct: (...args: Parameters<typeof import('./mock/mockRequestService')['updateRequestedProduct']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.updateRequestedProduct(...args)),
  voteForProduct: (...args: Parameters<typeof import('./mock/mockRequestService')['voteForProduct']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.voteForProduct(...args)),
  removeVote: (...args: Parameters<typeof import('./mock/mockRequestService')['removeVote']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.removeVote(...args)),
  hasVoted: (...args: Parameters<typeof import('./mock/mockRequestService')['hasVoted']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.hasVoted(...args)),
  getVoteCount: (...args: Parameters<typeof import('./mock/mockRequestService')['getVoteCount']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.getVoteCount(...args)),
  getVoterId: (...args: Parameters<typeof import('./mock/mockRequestService')['getVoterId']>) =>
    load(
      () => import('./mock/mockRequestService'),
      () => import('./firebase/requestService'),
    ).then((m) => m.getVoterId(...args)),
}

export const adminService = {
  getAdminUid: (...args: Parameters<typeof import('./mock/mockAdminService')['getAdminUid']>) =>
    load(
      () => import('./mock/mockAdminService'),
      () => import('./firebase/adminService'),
    ).then((m) => m.getAdminUid(...args)),
  listAdmins: (...args: Parameters<typeof import('./mock/mockAdminService')['listAdmins']>) =>
    load(
      () => import('./mock/mockAdminService'),
      () => import('./firebase/adminService'),
    ).then((m) => m.listAdmins(...args)),
  addAdmin: (...args: Parameters<typeof import('./mock/mockAdminService')['addAdmin']>) =>
    load(
      () => import('./mock/mockAdminService'),
      () => import('./firebase/adminService'),
    ).then((m) => m.addAdmin(...args)),
  removeAdmin: (...args: Parameters<typeof import('./mock/mockAdminService')['removeAdmin']>) =>
    load(
      () => import('./mock/mockAdminService'),
      () => import('./firebase/adminService'),
    ).then((m) => m.removeAdmin(...args)),
}
