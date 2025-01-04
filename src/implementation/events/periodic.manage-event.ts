import {ManageEvent} from 'src/domain/events/manage.event';
import { Period } from 'src/domain/models/period';

export class PeriodicManageEvent<T extends Period> extends ManageEvent<T> {}