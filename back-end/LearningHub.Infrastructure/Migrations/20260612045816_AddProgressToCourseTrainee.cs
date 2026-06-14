using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace LearningHub.Infrastructure.Migrations
{
    /// <inheritdoc />
    public partial class AddProgressToCourseTrainee : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "Progress",
                table: "CourseTrainee",
                type: "int",
                nullable: false,
                defaultValue: 0);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Progress",
                table: "CourseTrainee");
        }
    }
}
