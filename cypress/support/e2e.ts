import { configure } from '@testing-library/cypress';

import './commands';
import './type';

configure({ testIdAttribute: 'data-test-id' });
