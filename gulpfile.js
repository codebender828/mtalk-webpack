const gulp = require("gulp");
const rename = require("gulp-rename");
const parallelize = require("concurrent-transform");
const awspublish = require("gulp-awspublish");

const ossDir = "frontend/mirror-world/";
const publisher = awspublish.create({
  region: "us-west-1",
  params: {
    Bucket: "mirror-web",
  },
  accessKeyId: "AKIAW6AH4HKRJMLHGORU",
  secretAccessKey: "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",
});

gulp.task("publish-cdn", () => {
  return gulp
    .src("dist/**/*")
    .pipe(
      rename(function (path) {
        path.dirname = ossDir + path.dirname;
      })
    )
    .pipe(parallelize(publisher.publish(), 10))
    .pipe(awspublish.reporter());
});
