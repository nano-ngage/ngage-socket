# Contributing

## Detailed Workflow

### Fork the repo

Use github’s interface to make a fork of the repo, then add that repo as an upstream remote:

```
git remote add upstream https://github.com/nano-ngage/ngage.git
```

### Make a branch for every feature you work on

``` bash
# Creates your branch and brings you there
git checkout -b `your-branch-name`
```

Ultimately, what you call the branch is up to you. Name your branch so you can
identify it easily based on the content of the branch (i.e. feature specific,
a bug fix, refactor, testing, etc)

> NOTE: If you forget to make a branch and have un-staged/un-added files, DO NOT
add them to your local master branch. Make a new branch and the un-staged/un-added
files should transfer to your new branch as well. You can then git add and git commit
those files as normal and continue the rest of the process.

### Make commits to your feature branch.

Each commit should be formatted like so:
```bash
(TYPE_OF_COMMIT) DETAILS_OF_COMMIT
```
Examples:
(doc) Add contributing guidelines
(test) Update landing page tests
(feat) Add Dashboard component

Write your commits so that if another developer were to visit this repository's
git history, they would know what the commit did specifically and have the code
associated with the commit be consistent.

### Rebase upstream changes into your branch

Once you are done making changes, you can begin the process of getting
your code merged into the main repo.

First switch to your master branch and grab the latest updates from upstream

```bash
git checkout master
git pull --rebase upstream master
```

Then go back to your branch and rebase those changes to your branch:

```bash
git checkout `your-branch-name`
git rebase master
```

If a conflict arises between your new code and what exists on upstream,
git will yell at you to fix the conflicts. To get a better picture of what
conflicts you need to fix, type:

```bash
git status
```

You should see a picture something like this:
<img width="689" alt="rebase_conflict_ex" src="https://cloud.githubusercontent.com/assets/19274618/22439788/d9a80a0a-e6e5-11e6-822d-a2d1203f00e4.png">

In this example, it's saying there's a conflict in the package.json file. If you navigate to that file in your editor (sublime or atom), you'll see something like this:
<img width="716" alt="rebase_conflict_ex2" src="https://cloud.githubusercontent.com/assets/19274618/22439795/df2d93e6-e6e5-11e6-8ecc-3cb5c22d0808.png">


In this particular example, Maurice had added the dependencies mysql and sequelize while I had added request. To resolve this issue, simply delete the text that git inserted (the red highlighted text), and format the package.json to include all 3 (mysql, sequelize, and request):
<img width="630" alt="rebase_conflict_ex3" src="https://cloud.githubusercontent.com/assets/19274618/22439797/e2289c62-e6e5-11e6-901e-f5a48c2d626d.png">

> NOTE: When you are resolving conflicts, you will be on a different branch
> than your feature branch (it'll be a hash name), so don't be worried if you
> don't see the work on your branch. After rebasing it will return you back
> to your original branch.

Once you are done fixing conflicts for a specific commit, run:

```bash
git rebase --continue
```

This will continue the rebasing process. If all conflicts are resolved,
the rebase should complete. Go back to master and merge your branch with your
master as follows:

```bash
git checkout master
git merge --ff-only `your-branch-name`
```

Before pushing to your repo, check to see if your master branch has a linear
commit history that is the same linear history of the upstream master, *plus*
the additional commits you have with:

```bash
git hist
```

> Note: If you don't have the `git hist` alias, open your .gitconfig file and
> add the following alias to your .gitconfig:
> [alias]
> `hist = log --pretty=format:'%h %ad | %s%d [%an]' --graph --date=short`

Finally, push your code to your fork (origin/master). You will likely
run into difficulty pushing to your origin (i.e.
it says your local master has diverged from origin/master), so to successfully
push, type:

```bash
git push origin master -f
```

### Make a pull request

Make a clear pull request from your fork and branch to the upstream master
branch, detailing exactly what changes you made and what feature this
should add. The clearer your pull request is the faster you can get
your changes incorporated into this repo.

At least one other person MUST give your changes a code review, and once
they are satisfied they will merge your changes into upstream. Alternatively,
they may have some requested changes. You should make more commits to your
branch to fix these, then follow this process again from rebasing onwards.

If all changes are good to go, instead of doing the default merge, select the
drop down arrow next to the button and select the "Rebase and merge" option:
<img width="630" alt="rebase_and_merge" src="https://cloud.githubusercontent.com/assets/19274618/22439832/fc13f054-e6e5-11e6-8a5b-deb179ce2fde.png">

This should give us a nice, clean, linear history :)

Thanks for contributing!
