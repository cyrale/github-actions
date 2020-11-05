const core = require("@actions/core");

//[[ "$DOCKER_IS_TAG" = true ]] && echo "::set-output name=version_tag::${GITHUB_REF/refs\/tags\/v/}" || ( [[ "${GITHUB_REF/refs\/heads\//}" = "main" ]] && echo "::set-output name=version_tag::latest" || echo "::set-output name=version_tag::${GITHUB_REF/refs\/heads\//}" )

async function main() {
  try {
    const latestBranchName = core.getInput("latest_branch_name");
    const tagReplacePattern = core.getInput("tag_replace_pattern");
    const tagReplacement = core.getInput("tag_replacement");

    const ref = process.env.GITHUB_REF;

    if (!ref) {
      throw "GITHUB_REF is not defined.";
    }

    let tag = "";

    if (ref.startsWith("refs/tags/")) {
      tag = ref.replace("refs/tags/", "");

      if (tagReplacePattern) {
        tag = tag.replace(
          new RegExp(tagReplacePattern, "i"),
          tagReplacement || ""
        );
      }
    } else if (ref.startsWith("refs/heads/")) {
      tag = ref.replace("refs/heads/", "");

      if (tag === latestBranchName) {
        tag = "latest";
      }
    } else {
      throw "Unknown case.";
    }

    core.info(`ref=${ref}`);
    core.info(`tag=${tag}`);

    core.setOutput("tag", tag);
  } catch (err) {
    core.setFailed(err);
  }
}

main();
