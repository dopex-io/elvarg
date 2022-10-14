#!/bin/bash

if [[ $VERCEL_GIT_COMMIT_REF =~ "feat/diamond-pepes-2" ]] ; then
  echo ">> Skipping deploy!"
  exit 0;
else
  echo ">> Proceeding with deploy."
  exit 1; 
fi
