using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddCourseCodeToCourseTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "CourseCode",
                table: "Course",
                type: "nvarchar(20)",
                maxLength: 20,
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateIndex(
                name: "IX_Course_CourseCode",
                table: "Course",
                column: "CourseCode",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropIndex(
                name: "IX_Course_CourseCode",
                table: "Course");

            migrationBuilder.DropColumn(
                name: "CourseCode",
                table: "Course");
        }
    }
}
