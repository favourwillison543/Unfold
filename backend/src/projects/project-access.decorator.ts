import { SetMetadata } from '@nestjs/common';

import {
  ProjectPermission,
} from './project-access.service';

import {
  PROJECT_PERMISSION_KEY,
} from './project-access.constants';

export const ProjectAccess = (
  permission: ProjectPermission,
) =>
  SetMetadata(
    PROJECT_PERMISSION_KEY,
    permission,
  );