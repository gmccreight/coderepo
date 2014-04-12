#!/usr/bin/env bash

echo "note: the server is actually accessable at port 8080"
echo "so, for example, try http://localhost:8080/?template=stack_in_c"
vagrant ssh -c "cd /vagrant/api/app; DEBUG=codefluent-api ./bin/www"
