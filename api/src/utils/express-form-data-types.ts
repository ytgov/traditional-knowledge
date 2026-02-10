import { type File } from "multiparty"

/**
 * Example structure of files object from multiparty middleware:
 *
 * @example
 * ```typescript
 * files: {
 *   signedAcknowledgement: {
 *     fieldName: 'signedAcknowledgement',
 *     originalFilename: 'test-v2.docx',
 *     path: '/tmp/L_g7giiW_TJolj9rOisA6Tsi.docx',
 *     headers: [Object],
 *     size: 12151,
 *     name: 'test-v2.docx',
 *     type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
 *   }
 * }
 * ```
 */
export type ExpressFormDataFile = File
