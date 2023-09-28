/*
 * Copyright 2019 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import { DocumentSnapshot } from "firebase-functions/lib/providers/firestore";
import { Change } from "firebase-functions";

import { ChangeType } from "@firebaseextensions/firestore-bigquery-change-tracker";
import config from "./config";

export function getChangeType(change: Change<DocumentSnapshot>): ChangeType {
  if (!change.after.exists) {
    return ChangeType.DELETE;
  }
  if (!change.before.exists) {
    return ChangeType.CREATE;
  }
  return ChangeType.UPDATE;
}

export function getDocumentId(change: Change<DocumentSnapshot>): string {
  if (change.after.exists) {
    return change.after.id;
  }
  return change.before.id;
}

export function hasValidChanges(data:any, old_data:any): boolean {
  const  data_keys = Object.keys(data);
  const old_keys = Object.keys(old_data);
  var ignored_fields = config.ignoredFields || [];

  // Field either added or deleted
  if (JSON.stringify(data_keys) !== JSON.stringify(old_keys)) {
      return true;
  }
  for (let i = 0; i< data_keys.length; i++){
      let curr = data[data_keys[i]];
      let old = old_data[old_keys[i]];
      if((JSON.stringify(curr)!==JSON.stringify(old)) && (!ignored_fields.includes(data_keys[i]))) {
          return true;
      }
  }
  return false;
}