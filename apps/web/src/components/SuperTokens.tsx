import { SuperTokensReactConfig } from '@/config';
import SuperTokens from 'supertokens-auth-react';

SuperTokens.init(SuperTokensReactConfig);

function MyComponent(props: any) {
  if (SuperTokens.canHandleRoute()) {
    return SuperTokens.getRoutingComponent();
  }
  return 'Route not found';
}

export default MyComponent;
