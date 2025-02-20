import * as React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import Page from '../components/Page';
import Namespaces from './elements/Namespaces';
import Namespace from './elements/Namespace';

const GET_NAMESPACE = gql`
  query Namespace($path: String) {
    namespaces_v1(path: $path) {
      path
      name
      description
      grafanaUrl
      cluster {
        name
        path
        jumpHost {
          hostname
        }
        consoleUrl
      }
      app {
        name
        path
      }
      managedTerraformResources
      terraformResources {
        provider
        account
        identifier
        output_resource_name
      }
    }
    roles_v1 {
      path
      name
      description
      access {
        namespace {
          name
          cluster {
            name
          }
        }
        role
      }
    }
  }
`;

const GET_NAMESPACES = gql`
  query Namespaces {
    namespaces_v1 {
      path
      name
      description
      grafanaUrl
      cluster {
        name
        path
        jumpHost {
          hostname
        }
      }
      app {
        name
        path
      }
    }
  }
`;
const NamespacesPage = ({ location }) => {
  const path = location.hash.substring(1);
  if (path) {
    return (
      <Query query={GET_NAMESPACE} variables={{ path }}>
        {({ loading, error, data }) => {
          if (loading) return 'Loading...';
          if (error) return `Error! ${error.message}`;
          const namespace = data.namespaces_v1[0];
          const roles = data.roles_v1;
          const body = <Namespace namespace={namespace} roles={roles} />;
          return <Page title={namespace.name} body={body} path={namespace.path} />;
        }}
      </Query>
    );
  }

  return (
    <Query query={GET_NAMESPACES}>
      {({ loading, error, data }) => {
        if (loading) return 'Loading...';
        if (error) return `Error! ${error.message}`;
        const body = <Namespaces namespaces={data.namespaces_v1} />;
        return <Page title="Namespaces" body={body} />;
      }}
    </Query>
  );
};

export default NamespacesPage;
