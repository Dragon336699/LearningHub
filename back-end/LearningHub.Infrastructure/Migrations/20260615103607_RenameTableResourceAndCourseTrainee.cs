using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class RenameTableResourceAndCourseTrainee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseTrainee_AspNetUsers_TraineeId",
                table: "CourseTrainee");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseTrainee_Course_CourseId",
                table: "CourseTrainee");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CourseTrainee",
                table: "CourseTrainee");

            migrationBuilder.RenameTable(
                name: "CourseTrainee",
                newName: "CourseTrainees");

            migrationBuilder.RenameIndex(
                name: "IX_CourseTrainee_TraineeId",
                table: "CourseTrainees",
                newName: "IX_CourseTrainees_TraineeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CourseTrainees",
                table: "CourseTrainees",
                columns: new[] { "CourseId", "TraineeId" });

            migrationBuilder.AddForeignKey(
                name: "FK_CourseTrainees_AspNetUsers_TraineeId",
                table: "CourseTrainees",
                column: "TraineeId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseTrainees_Courses_CourseId",
                table: "CourseTrainees",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseTrainees_AspNetUsers_TraineeId",
                table: "CourseTrainees");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseTrainees_Courses_CourseId",
                table: "CourseTrainees");

            migrationBuilder.DropPrimaryKey(
                name: "PK_CourseTrainees",
                table: "CourseTrainees");

            migrationBuilder.RenameTable(
                name: "CourseTrainees",
                newName: "CourseTrainee");

            migrationBuilder.RenameIndex(
                name: "IX_CourseTrainees_TraineeId",
                table: "CourseTrainee",
                newName: "IX_CourseTrainee_TraineeId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_CourseTrainee",
                table: "CourseTrainee",
                columns: new[] { "CourseId", "TraineeId" });

            migrationBuilder.AddForeignKey(
                name: "FK_CourseTrainee_AspNetUsers_TraineeId",
                table: "CourseTrainee",
                column: "TraineeId",
                principalTable: "AspNetUsers",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_CourseTrainee_Course_CourseId",
                table: "CourseTrainee",
                column: "CourseId",
                principalTable: "Courses",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
